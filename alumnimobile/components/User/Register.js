import { View, Text, Image, ScrollView, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { Button, HelperText, TextInput, TouchableRipple } from "react-native-paper";
import Styles from "./Styles";
import React from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { IconButton } from 'react-native-paper';

const Register = () => {
    const [user, setUser] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState({});

    const nav = useNavigation();

    const fields = [{
        "label": "Tên",
        "icon": "text",
        "name": "first_name"
    }, {
        "label": "Họ và tên lót",
        "icon": "text",
        "name": "last_name"
    }, {
        "label": "Tên đăng nhập",
        "icon": "account",
        "name": "username"
    }, {
        "label": "Email",
        "icon": "email",
        "name": "email"
    }, {
        "label": "Mật khẩu",
        "icon": "eye",
        "secureTextEntry": true,
        "name": "password"
    }, {
        "label": "Xác nhận mật khẩu",
        "icon": "eye",
        "secureTextEntry": true,
        "name": "confirm"
    }];

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    // Hàm mô phỏng kiểm tra email tồn tại
    const checkIfEmailExists = async (email) => {
        try {
            // Mô phỏng thời gian chờ (có thể xóa dòng này trong môi trường thực tế)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Giả sử email đã tồn tại nếu trùng với một giá trị cứng
            const existingEmail = "test@example.com";

            if (email === existingEmail) {
                return true; // Email đã tồn tại
            } else {
                return false; // Email chưa tồn tại
            }
        } catch (error) {
            console.error("Error checking email existence:", error);
            return false; // Trường hợp lỗi, mặc định là email chưa tồn tại
        }
    }
    const validatePassword = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }

    const picker = async () => {
        try { 
            let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permissions denied!");
            } else {
                const result = await ImagePicker.launchImageLibraryAsync();
                if (!result.canceled)
                    setUser(current => {
                        return { ...current, "avatar": result.assets[0] }
                    });
                    
        }} catch (error) {
            console.error("Error selecting avatar: ", error);
            Alert.alert("Xuất hiện lỗi khi chọn ảnh");
        }
    }

    
    const register = async () => {
        let errors = {};

        // Kiểm tra các trường thông tin
        fields.forEach(f => {
            if (!user[f.name]) {
                errors[f.name] = `Vui lòng nhập ${f.label.toLowerCase()}`;
            }
        });

        // Kiểm tra email hợp lệ
        if (user.email && !validateEmail(user.email)) {
            errors.email = "Email không hợp lệ";
            
        }

        // Kiểm tra mật khẩu và xác nhận mật khẩu
        if (user.password && !validatePassword(user.password)) {
            errors.password = "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
        }

        if (user.password !== user.confirm) {
            errors.confirm = "Mật khẩu không khớp";
        }

        // Nếu có lỗi, cập nhật state và return
        if (Object.keys(errors).length > 0) {
            setError(errors);
            return;
        } else {
            setError({});
        }

        setLoading(true)
        try {
            let form = new FormData();
            
            for (let key in user){
                if (key !== 'confirm')
                    if (key == 'avatar') {
                        form.append(key, {
                           uri: user.avatar.uri,
                           name: user.avatar.fileName ,
                           type: user.avatar.type || 'image/jpeg'
                        });
                    } else {
                        form.append(key, user[key]);
                    }
            }
            
            let response = await APIs.post(endpoints['register'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Response status:", response.status, );

            
            if (response.status === 201) {
                Alert.alert("Thông báo", "Đăng ký thành công!");
                nav.navigate("Login");
            } else {
                let errorResponse = await response.json();
                Alert.alert("Đăng ký thất bại", errorResponse.message || "Có lỗi xảy ra.");
            }
        } catch (ex) {
            Alert.alert("Lỗi đăng ký tài khoản", ex.message)
            console.log("Lỗi trong quá trình đăng kí: ", ex.message);
        } finally {
            setLoading(false);
        }
    }

    const CustomIcon = ({ icon = 'default-icon', ...props }) => (
        <IconButton icon={icon} {...props} />
    );
    // mỗi khi người dùng thay đổi dữ liệu trong các trường nhập liệu, trạng thái của ứng dụng sẽ được cập nhật tương ứng
    const updateState = (field, value) => {
        setUser(current => {
            return { ...current, [field]: value }
        })
    }

    return (
        <View style={Styles.container}>
            <ScrollView contentContainerStyle={Styles.scrollView}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={Styles.header}>
                        <Text style={Styles.title}>Đăng ký </Text>
                    </View>
                    {fields.map(f => (
                        <View key={f.label} style={Styles.inputContainer}>
                            <TextInput
                                value={user[f.name]}
                                onChangeText={t => updateState(f.name, t)}
                                style={Styles.input}
                                label={f.label}
                                secureTextEntry={f.secureTextEntry}
                                right={<CustomIcon icon={f.icon} />}
                                error={!!error[f.name]}
                            />
                            <HelperText type="error" visible={!!error[f.name]}>
                                {error[f.name]}
                            </HelperText>
                        </View>
                    ))}
                    
                    <TouchableRipple onPress={picker}>
                        <Text style={Styles.selectAvatarText}>Chọn hình đại diện...</Text>
                    </TouchableRipple>

                    {user?.avatar && <Image
                        source={{ uri: user.avatar.uri }}
                        style={Styles.avatar}
                    />}

                    <Button 
                        style={Styles.button} 
                        labelStyle={Styles.buttonText}
                        loading={loading} 
                        mode="contained" 
                        onPress={register}
                    >
                        Đăng ký
                    </Button>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
}

export default Register;
