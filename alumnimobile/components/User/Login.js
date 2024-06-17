import { View, Text, ScrollView, KeyboardAvoidingView, Platform, AsyncStorage, Alert,token } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Styles from "./Styles";
import React, { useContext } from "react";
import APIs, { authAPI, endpoints } from "../../configs/APIs";
import { MyDispatcherContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from 'react-native-paper';

const Login = () => {
    const fields = [{
        "label": "Tên đăng nhập",
        // "icon": "account",
        "name": "username"
    }, {
        "label": "Mật khẩu",
        // "icon": "eye",
        "secureTextEntry": true,
        "name": "password"
    }];
    const [user, setUser] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const dispatch = useContext(MyDispatcherContext);
    const nav = useNavigation();

    const login = async () => {
        setLoading(true);

        try {
            console.info("Thông tin người dùng:", user);
            let res = await APIs.post(endpoints['login'], {
                ...user,
                'client_id': 'Ap91RYqwPglTWPf40tX38kTvwSxUd7pkLT9u8N06 ',
                'client_secret': 'kHAcLZThhQzWKCPOhbxrAcvnoPytoEhr9kfnZ4wSZIvqCjpuStaILA4V8TSeGggBfqIpgoyMpB6rwT2x9qHsQd2IJ8iwkY2lqPTH6VFDbeoCGEDnTbptMoDz1NSOvBKG',
                'grant_type': 'password'
            });
            
            console.info(res.data);


            // Kiểm tra phản hồi từ máy chủ
            console.info("Phản hồi từ máy chủ:", res.data);

            // Lưu token truy cập vào AsyncStorage
            AsyncStorage.setItem('token', res.data.access_token);


                        // Lấy thông tin người dùng hiện tại sau khi đăng nhập thành công
            setTimeout(async () => {
                let user = await authAPI(token).get(endpoints['current_user']);
                console.info(user.data);
            }, 100);

            if(user.status == 200 ){
                console.log("Đăng ký thành công!");
                nav.navigate('Home');
            }
        } catch (ex) {
            console.error("Lỗi khi đăng nhập:", ex);
            // Kiểm tra chi tiết lỗi nếu có
            if (ex.response) {
                console.log("Phản hồi lỗi từ máy chủ:", ex.response.data);
            } else {
                Alert.alert("Lỗi kết nối", "Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    }

    const updateState = (field, value) => {
        setUser(current => {
            return { ...current, [field]: value }
        })
    }

    return (
        <View style={Styles.container}>
            <ScrollView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={Styles.header}>
                        <Text style={Styles.title}>Đăng nhập</Text>
                    </View>
                    {fields.map(f => (
                        <TextInput 
                            value={user[f.name]} 
                            onChangeText={t => updateState(f.name, t)} 
                            key={f.label} 
                            style={Styles.input} 
                            label={f.label} 
                            secureTextEntry={f.secureTextEntry} 
                            right={<IconButton icon={f.icon} />} 
                        />
                    ))}

                    <Button 
                        style={Styles.button} 
                        labelStyle={Styles.buttonText}
                        loading={loading} 
                        // icon="account" 
                        mode="contained" 
                        onPress={login}
                    >
                        Đăng nhập
                    </Button>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
}

export default Login;