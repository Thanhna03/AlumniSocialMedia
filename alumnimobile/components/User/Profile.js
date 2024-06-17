import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Button, IconButton, Avatar } from 'react-native-paper';
import Styles from "./Styles"; // Import styles từ file Styles.js
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [posts, setPosts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                let res = await APIs.get(endpoints['current_user']);
                setProfile(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchPosts = async () => {
            setLoading(true);
            try {
                let res = await APIs.get(endpoints['user_posts']);
                setPosts(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
        fetchPosts();
    }, []);

    const handleEditProfile = () => {
        setEditing(true);
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            let res = await APIs.put(endpoints['current_user'], profile);
            setProfile(res.data);
            setEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            setLoading(true);
            await APIs.delete(`${endpoints['user_posts']}/${postId}`);
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={Styles.container}>
            <View style={Styles.header}>
                <Image source={{ uri: profile.coverPhoto }} style={Styles.coverPhoto} />
                <Avatar.Image source={{ uri: profile.avatar }} size={100} style={Styles.avatar} />
                {editing ? (
                    <View style={Styles.editContainer}>
                        <TextInput
                            style={Styles.input}
                            value={profile.firstName}
                            onChangeText={(text) => setProfile({ ...profile, firstName: text })}
                        />
                        <TextInput
                            style={Styles.input}
                            value={profile.lastName}
                            onChangeText={(text) => setProfile({ ...profile, lastName: text })}
                        />
                        <TextInput
                            style={Styles.input}
                            value={profile.username}
                            onChangeText={(text) => setProfile({ ...profile, username: text })}
                        />
                        <TextInput
                            style={Styles.input}
                            value={profile.studentId}
                            onChangeText={(text) => setProfile({ ...profile, studentId: text })}
                        />
                        <Button mode="contained" onPress={handleSaveProfile} loading={loading}>
                            Save
                        </Button>
                    </View>
                ) : (
                    <View style={Styles.infoContainer}>
                        <Text style={Styles.name}>{profile.firstName} {profile.lastName}</Text>
                        <Text style={Styles.username}>@{profile.username}</Text>
                        <Text style={Styles.studentId}>Student ID: {profile.studentId}</Text>
                        <Button mode="contained" onPress={handleEditProfile}>
                            Edit Profile
                        </Button>
                    </View>
                )}
            </View>
            <View style={Styles.timeline}>
                {posts.map(post => (
                    <View key={post.id} style={Styles.post}>
                        <Text style={Styles.postContent}>{post.content}</Text>
                        <TouchableOpacity style={Styles.deleteButton} onPress={() => handleDeletePost(post.id)}>
                            <Text style={Styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

export default Profile;
