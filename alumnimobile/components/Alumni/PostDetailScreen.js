// PostDetailScreen.js

import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import MyStyles from "../../styles/MyStyles"; // Import styles từ file MyStyles.js
import moment from 'moment';
import APIs, { endpoints } from "../../configs/APIs"; 


const PostDetailScreen = ({ route, navigation }) => {
    // Lấy thông tin bài viết từ route params
    const { post, postId } = route.params;
    const [comments, setComments] = React.useState([]);
    const [loading, setLoading] = React.useState(false); // Trạng thái tải bình luận


    const loadComments = async () => {
        setLoading(true); // Bắt đầu trạng thái tải
        try {
            let url = endpoints['comments'](postId);
            let res = await APIs.get(url); 
            setComments(res.data.results);
        } catch (error) {
            console.error("Lỗi khi tải bình luận:", error);
        } finally {
            setLoading(false); // Kết thúc trạng thái tải
        }
    }

    React.useEffect(() => {
        loadComments();
    }, [ postId]);
    return (
        <View style={MyStyles.container}>
            <ScrollView>
                {/* Header với avatar và tên người dùng */}
                <View style={MyStyles.header}>
                    <Image
                        style={MyStyles.avatar}
                        source={{ uri: post.user.avatar || 'https://example.com/default-avatar.png' }}
                    />
                    <Text style={MyStyles.userName}>
                        {post.user.first_name || post.user.last_name ? `${post.user.first_name} ${post.user.last_name}` : 'Người dùng'}
                    </Text>
                </View>

                {/* Nội dung bài viết */}
                <Text style={MyStyles.content}>{post.content}</Text>

                {/* Hình ảnh bài đăng */}
                {post.images && post.images.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={MyStyles.imageScrollView}>
                        {post.images.map((image, index) => (
                            <Image
                                key={index}
                                style={MyStyles.postImage}
                                source={{ uri: image.image }}
                            />
                        ))}
                    </ScrollView>
                )}
    
                {/* Danh sách các bình luận */}
                <View style={MyStyles.commentsSection}>
                    <Text style={MyStyles.commentsTitle}>Bình luận</Text>
                    {comments.length > 0 ? comments.map((comment, index) => (
                        <View key={index} style={MyStyles.commentItem}>
                            <Image
                                style={MyStyles.commentAvatar}
                                source={{ uri: comment.user.avatar }}
                            />
                            <View style={MyStyles.commentContent}>
                                <Text style={MyStyles.commentUser}>
                                    {comment.user.first_name} {comment.user.last_name}
                                </Text>
                                <Text style={MyStyles.commentText}>{comment.comment}</Text>
                                <Text style={MyStyles.commentDate}>{moment(comment.created_date).fromNow()}</Text>
                            </View>
                        </View>
                    )) : (
                        <Text>Chưa có bình luận nào.</Text>
                    )}
                </View>

                {/* Nút quay lại */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={MyStyles.button}>
                    <Text style={MyStyles.buttonText}>Quay lại</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

export default PostDetailScreen;
