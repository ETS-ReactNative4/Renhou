import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Global from '../../../Global';
import axios from 'axios';

class RoomInfoDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Chi tiết phòng',
            headerRight: (
                <TouchableOpacity onPress={() => params.handleEdit()}>
                    <Text style={styles.headerRightButton}>{params.editable}</Text>
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor: 'white',
            },
            headerTitleStyle: {
                color: Global.COLOR.NAVIGATION,
            },
            headerTintColor: Global.COLOR.NAVIGATION,
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            editable: false,
            name: '',
            address: '',
            roomCost: '',
            perElectricCost: '',
            perWaterCost: '',
        }
    }
    componentDidMount() {
        const { navigation } = this.props;
        const roomID = navigation.getParam('roomID');
        const url = Global.host + '/room/' + roomID;
        axios.get(url).then(res => {
            const resData = res.data;
            this.setState({
                name: resData.data.room.name,
                address: resData.data.room.address,
                roomCost: this.styleMoney(resData.data.rule.roomCost),
                perElectricCost: this.styleMoney(resData.data.rule.perElectricCost),
                perWaterCost: this.styleMoney(resData.data.rule.perWaterCost),
            })
        });
        navigation.setParams({
            editable: 'Sửa',
            handleEdit: () => {
                if (!this.state.editable)
                    navigation.setParams({
                        editable: 'Lưu',
                    });
                else {
                    this.handleEdit(roomID);
                    navigation.setParams({
                        editable: 'Sửa',
                    });
                }
                this.setState({ editable: !this.state.editable });
            }
        });
    }
    handleEdit(roomId) {
        const url = Global.host + '/room/feecost';
        axios.put(url, {
            roomId,
            address: this.state.address,
            roomCost: parseInt(this.state.roomCost.replace(/\./g, ''), 10),
            perElectricCost: parseInt(this.state.perElectricCost.replace(/\./g, ''), 10),
            perWaterCost: parseInt(this.state.perWaterCost.replace(/\./g, ''), 10),
        }).then().catch(error => console.log(error));
    }
    styleMoney(money) {
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    render() {
        const { navigation } = this.props;
        const name = navigation.getParam('name');
        return (
            <ScrollView style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.text}>Tên phòng</Text>
                    <Text style={styles.data}>{name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Địa chỉ</Text>
                    <TextInput style={styles.data} editable={this.state.editable} value={this.state.address} onChangeText={text => this.setState({ address: text })} />
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Giá phòng</Text>
                    <TextInput style={styles.data} editable={this.state.editable} keyboardType={'numeric'} value={this.state.roomCost} onChangeText={text => {
                        const intMoney = parseInt(text.replace(/\./g, ''), 10);
                        this.setState({ roomCost: text === '' ? '' : this.styleMoney(intMoney) })
                    }} />
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Đơn giá điện</Text>
                    <TextInput style={styles.data} editable={this.state.editable} keyboardType={'numeric'} value={this.state.perElectricCost} onChangeText={text => {
                        const intMoney = parseInt(text.replace(/\./g, ''), 10);
                        this.setState({ perElectricCost: text === '' ? '' : this.styleMoney(intMoney) })
                    }} />
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Đơn giá nước</Text>
                    <TextInput style={styles.data} editable={this.state.editable} keyboardType={'numeric'} value={this.state.perWaterCost} onChangeText={text => {
                        const intMoney = parseInt(text.replace(/\./g, ''), 10);
                        this.setState({ perWaterCost: text === '' ? '' : this.styleMoney(intMoney) })
                    }} />
                </View>
            </ScrollView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Global.COLOR.BACKGROUND,
        paddingVertical: 10,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        borderBottomWidth: 0.5,
        borderColor: Global.COLOR.GRAY,
        paddingVertical: 10,
    },
    text: {
        flex: 1,
        paddingVertical: 5,
        fontSize: 16,
        textAlign: 'left',
        borderRadius: 12,
    },
    data: {
        flex: 2,
        fontSize: 16,
        textAlign: 'right',
        color: Global.COLOR.GRAY,
    },
    headerRightButton: {
        marginRight: 16,
        fontSize: 16,
        color: Global.COLOR.NAVIGATION,
        fontWeight: 'bold',
    }
});

export default RoomInfoDetail;