import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5', // Màu nền giống với Facebook
        padding: 10,
    },
    subject: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
        textAlign: 'center',
        marginVertical: 20,
    },
    postContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5, // Dành cho Android
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    imageScrollView: {
        marginBottom: 10,
    },
    postImage: {
        width: 300, // Chiều rộng của mỗi hình ảnh trong chế độ cuộn ngang
        height: 200,
        borderRadius: 10,
        marginRight: 10, // Khoảng cách giữa các hình ảnh
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#e4e6eb',
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#606770',
    },
    commentsSection: {
        marginTop: 20,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentItem: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f1f1f1',
    },
    commentUser: {
        fontWeight: 'bold',
    },
    commentText: {
        marginTop: 5,
        marginBottom: 5,
    },
    commentDate: {
        fontSize: 12,
        color: '#888',
    },
       searchBar: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    commentContent: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 10,
    },
    timeAgo: {
        fontSize: 12,
        color: 'grey',
        marginLeft: 10,
    },
    searchBar: {
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderColor: 'lightblue',
        borderWidth: 1,
        marginBottom: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        }
    },
});
