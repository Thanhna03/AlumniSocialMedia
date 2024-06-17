import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, TextInput } from "react-native";
import Styles from "./Styles";
import React, { useCallback } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import moment from "moment";
import "moment/locale/vi";
import { isCloseToBottom } from "../../configs/Utils";

const Post = ({navigation}) => {
    const [posts, setPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [postId, setPostId] = React.useState("");
    const [q, setQ] = React.useState("");
    const [refreshing, setRefreshing] = React.useState(false);

    // Hàm load bài viết từ API
    const loadPosts = async (reset = false) => {
        if (page > 0) {
            if (reset) {
                setPage(1);
                setPosts([]);
            }
            setLoading(true);
            try {
                console.info(page);
                let url = `${endpoints['posts']}?q=${q}&post_id=${postId}`;
                if (page > 0)
                    url = `${url}&page=${page}`;
                let res = await APIs.get(url);

                if (page === 1)
                    setPosts(res.data.results);
                else
                    setPosts(current => [...current, ...res.data.results]);
                if (res.data.next === null)
                    setPage(0);
            } catch (ex) {
                console.error('Lỗi khi gọi API:', ex.message);
                if (ex.response) {
                    console.error('Lỗi phản hồi dữ liệu API:', ex.response.data);
                }
            } finally {
                setLoading(false);
                if (reset) setRefreshing(false);
            }
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadPosts(true);
    };

    React.useEffect(() => {
        loadPosts();
    }, [q, postId, page]);

    const loadMore = ({ nativeEvent }) => {
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    };

    // Hàm tìm kiếm cập nhật từ khóa và tải lại trang
    const search = useCallback((value) => {
        setQ(value);
        setPage(1);
        loadPosts(true);
    }, []);

    // Hàm lọc bài viết dựa trên từ khóa
    const filteredPosts = posts.filter(post => 
        post.content.toLowerCase().includes(q.toLowerCase())
    );

    return (
        <View style={Styles.container}>
            <Text style={Styles.subject}>HIỂN THỊ BÀI VIẾT</Text>

            {/* Thanh tìm kiếm */}
            <TextInput
                style={Styles.searchBar}
                placeholder="Tìm kiếm theo tên bài viết..."
                value={q}
                onChangeText={search}
            />

            {loading && page === 1 ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ScrollView
                    onScroll={loadMore}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View>
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map(post => (
                                <View key={post.id} style={Styles.postContainer}>
                                    <View style={Styles.header}>
                                        <Image
                                            style={Styles.avatar}
                                            source={{ uri: post.user.avatar || 'https://example.com/default-avatar.png' }}
                                            onError={(error) => console.log('Image load error:', error)}
                                        />
                                        <Text style={Styles.userName}>
                                            {post.user.first_name || post.user.last_name ? `${post.user.first_name} ${post.user.last_name}` : 'Người dùng'}
                                        </Text>
                                        <Text style={Styles.timeAgo}>
                                            {moment(post.created_date).fromNow()}
                                        </Text>
                                    </View>
                                    <Text style={Styles.content}>{post.content}</Text>
                                    {post.images && post.images.length > 0 && (
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={Styles.imageScrollView}>
                                            {post.images.map((image, index) => (
                                                <Image
                                                    key={index}
                                                    style={Styles.postImage}
                                                    source={{ uri: image.image }}
                                                    onError={(error) => console.log('Image load error:', error)}
                                                />
                                            ))}
                                        </ScrollView>
                                    )}
                                    <View style={Styles.footer}>
                                        <TouchableOpacity style={Styles.button}>
                                            <Text style={Styles.buttonText}>React</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={Styles.button}
                                            onPress={() => navigation.navigate('PostDetailScreen', { post, postId: post.id })}
                                        >
                                            <Text style={Styles.buttonText}>Comment</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text>Không tìm thấy bài viết</Text>
                        )}
                    </View>
                    {loading && page > 1 && <ActivityIndicator />}
                </ScrollView>
            )}
        </View>
    );
}

export default Post;
