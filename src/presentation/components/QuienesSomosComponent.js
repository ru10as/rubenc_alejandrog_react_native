import React, { Component } from 'react';
import { FlatList, View, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Card, Text, List, Divider } from 'react-native-paper';
import { baseUrl } from '../../comun/comun';
import { IndicadorActividad } from './IndicadorActividadComponent';
import { useTranslation } from 'react-i18next';

const mapStateToProps = (state) => ({
    actividades: state.actividades || { isLoading: false, errMess: null, actividades: [] },
});

function Historia() {
    const { t } = useTranslation();

    return (
        <Card style={styles.card}>
            {/* Título más institucional */}
            <Card.Title 
                title={t('quienes_somos.historia.titulo')} 
                subtitle={t('quienes_somos.historia.subtitulo')}
                titleStyle={styles.cardTitle} 
            />
            <Card.Content>
                <Text style={styles.textoDeHistoria}>
                    {t('quienes_somos.historia.descripcion_larga')}
                </Text>
                
                <Divider style={[styles.linea, { marginVertical: 15, width: '100%' }]} />
                
                <Text style={styles.textoAgradecimiento}>
                    {t('quienes_somos.historia.agradecimiento')}
                </Text>
                <Text style={styles.firma}>{t('quienes_somos.historia.firma')}</Text>
            </Card.Content>
        </Card>
    );
}

class QuienesSomos extends Component {
    renderActividadItem = ({ item }) => (
        <View>
            <List.Item
                title={item.nombre}
                titleStyle={{ fontWeight: 'bold' }}
                description={item.descripcion}
                descriptionNumberOfLines={20}
                left={props => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Avatar.Image
                            {...props}
                            size={48}
                            style={{ backgroundColor: 'transparent', marginLeft: 10 }}
                            source={{ uri: baseUrl + item.imagen }}
                        />
                    </View>
                )}
            />
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
    card: { margin: 15, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    cardTitle: { textAlign: 'center', fontWeight: 'bold', marginTop: 20, fontSize: 20 },
    textoDeHistoria: { textAlign: 'justify', marginBottom: 10, lineHeight: 20 },
    linea: { marginBottom: 5, height: 1, width: '85%', alignSelf: 'center' },
});

export default connect(mapStateToProps)(QuienesSomos);
