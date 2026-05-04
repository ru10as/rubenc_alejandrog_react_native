import React from "react";
import { ScrollView,StyleSheet } from "react-native";
import { Card,Text,Divider } from "react-native-paper";


function Contacto(){
    return(
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Contacto" titleStyle={styles.cardTitle}>
                </Card.Title>

                <Card.Content>
                    <Text style={styles.parrafo}>
                        Kaixo Mendizale!
                    </Text>
                    <Text style={styles.parrafo}>
                        Si quieres participar en las salidas de montaña que organizamos o 
                        quieres hacerte soci@ de Gaztaroa, puedes contactar con nosotros a 
                        través de diferentes medios. Puedes llamarnos por teléfono los jueves 
                        de las semanas que hay salida (de 20:00 a 21:00). También puedes 
                        ponerte en contacto con nosotros escribiendo un correo electrónico, o 
                        utilizando la aplicación de esta página web. Y además puedes 
                        seguirnos en Facebook.
                    </Text>
                    <Text style={styles.parrafo}>
                        Para lo que quieras, estamos a tu disposición!
                    </Text>
                    <Text style={styles.datosDeContacto}>Tel: +34 948 277151</Text>
                    <Text style={styles.datosDeContacto}>Email: gaztaroa@gaztaroa.com</Text>
                </Card.Content>
            </Card>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    card:{
        margin:15,
        borderRadius:10,
    },
    cardTitle:{
        fontWeight:'bold',
        fontSize:25,
        textAlign:'center',
        padding:3,
        marginTop:15,
        marginBottom:15,
    },
    cardContent:{
        marginTop:10,
    },
    parrafo:{
        marginBottom:10,
    },
    datosDeContacto:{
        marginTop:5,
    },
    media:{
        height:160,
    },
    linea:{
        marginBottom:20,
        height:1,
        width: '85%',
        alignSelf: 'center',
    },
});

export default Contacto;