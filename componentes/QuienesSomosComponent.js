import React from "react";
import { Component } from "react";
import { FlatList, View, ScrollView, StyleSheet } from "react-native";
import { connect } from 'react-redux';
import { Avatar, Card, Text, List, Divider } from "react-native-paper";
import { baseUrl, colorGaztaroaOscuro } from '../comun/comun';
import { IndicadorActividad } from './IndicadorActividadComponent';

const mapStateToProps = (state) => {
    return {
        actividades: state.actividades
    }
}

function Historia(){
    return(
        <Card style={styles.card}>
            <Card.Title title="Un poquito de historia" titleStyle={styles.cardTitle}></Card.Title>
            <Card.Content>
                <Text style={styles.textoDeHistoria}>
                    El nacimiento del club de montaña Gaztaroa se remonta a la 
                    primavera de 1976 cuando jóvenes aficionados a la montaña y 
                    pertenecientes a un club juvenil decidieron crear la sección 
                    montañera de dicho club. Fueron unos comienzos duros debido sobre 
                    todo a la situación política de entonces. Gracias al esfuerzo 
                    económico de sus socios y socias se logró alquilar una bajera. 
                    Gaztaroa ya tenía su sede social.
                </Text>
                <Text style={styles.textoDeHistoria}>
                    Desde aquí queremos hacer llegar nuestro agradecimiento a todos 
                    los montañeros y montañeras que alguna vez habéis pasado por el 
                    club aportando vuestro granito de arena.
                </Text>
                <Text style={styles.textoDeHistoria}>
                    Gracias!
                </Text>
            </Card.Content>
        </Card>
    )
}



class QuienesSomos extends Component {
    constructor(props){
        super(props);
    }

    renderActividadItem = ({item}) => (
        <View>
            <List.Item 
                title={item.nombre}
                titleStyle={{fontWeight:'bold'}}
                description={item.descripcion}
                descriptionNumberOfLines={20}
                left={props => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Avatar.Image 
                            {...props}
                            size={48}
                            style={{backgroundColor: 'transparent', marginLeft:10}}
                            source={{uri: baseUrl + item.imagen}}
                        />
                    </View>
            )}/>
            <Divider style={styles.linea} />
        </View>
    );

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#f0f0f0' }}>
                <Historia />

                <Card style={styles.card}>
                    <Card.Title title="Actividades y recursos" titleStyle={styles.cardTitle} />
                    
                    {this.props.actividades.isLoading ? (
                        <IndicadorActividad />
                    ) : this.props.actividades.errMess ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text>{this.props.actividades.errMess}</Text>
                        </View>
                    ) : (
                        this.props.actividades.actividades.map((item) => (
                            <View key={item.id.toString()}>
                                {this.renderActividadItem({ item })}
                            </View>
                        ))
                    )}
                </Card>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    card:{
        margin: 15,
        elevation:4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle:{
        textAlign:'center',
        fontWeight:'bold',
        marginTop:20,
        fontSize: 20,
    },
    textoDeHistoria:{
        textAlign:'justify',
        marginBottom:10,
        lineHeight:20,
    },
    linea:{
        marginBottom:5,
        height:1,
        width: '85%',
        alignSelf: 'center',
    }
});



export default connect(mapStateToProps)(QuienesSomos);