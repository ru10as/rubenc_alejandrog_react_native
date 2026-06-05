import React, { Component } from 'react';
import { FlatList, View, Image, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, Divider, Text, Searchbar, Chip } from 'react-native-paper';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { IndicadorActividad } from './IndicadorActividadComponent';

const mapStateToProps = state => ({
    camisetas: state.camisetas,
});

class Catalogo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textoBusqueda: '', // Vacio para antes de que empiece a escribir
            expanded: false, // Para el panel de filtros
            filtros: {
                modo: 'tienda', 
                pais: '',
                equipo: '',
                talla: '',
            }
        };
    }

    // Esta es para ir actualizando que camisetas se ven basandonos en los botones que el usuario pulse
    gestionarFiltro = (categoria, valor) => {
        this.setState(prevState => ({
            filtros: {
                ...prevState.filtros,
                [categoria]: prevState.filtros[categoria] === valor ? '' : valor
            }
        }));
    };

    // Cuando pasamos de un modo a otro, limpiamos todo lo demas
    cambiarModo = (nuevoModo) => {
        this.setState({
            filtros: { modo: nuevoModo, pais: '', equipo: '', talla: '' }
        });
    };

    // Es un interruptor lógico que invierte el estado actual (
    handlePressAcordeon = () => {
        this.setState(prevState => ({ expanded: !prevState.expanded }));
    };

    render() {
        const { navigate } = this.props.navigation; // Para movernos entre pantallas
        const { t, i18n } = this.props;
        const { textoBusqueda, filtros, expanded } = this.state;
        const esSegundaMano = filtros.modo === 'segunda_mano'; // Para mostrar la logica habitual o la de segunda mano

        const renderItem = ({ item }) => {
            const nombreTraducido = item.nombres?.[i18n.language] || item.nombres?.['es'] || item.nombre;
            const descripcionTraducida = item.descripciones?.[i18n.language] || item.descripciones?.['es'] || item.descripcion;
            const estaVendida = item.estadoVenta === 'vendida';

            return (
                <View>
                    <List.Item
                        title={`${nombreTraducido} ${estaVendida ? `(${t('catalogoComponent.vendida')})` : ''}`}
                        description={descripcionTraducida}
                        titleNumberOfLines={0}
                        descriptionNumberOfLines={2}
                        onPress={() => !estaVendida && (item.estado === 'usada' ? navigate('DetalleCamisetaSMano', { camiseta: item }) : navigate('DetalleCamiseta', { camisetaId: item.id }))}
                        left={() => (
                            <View style={styles.imagenContainer}>
                                <Image source={{ uri: item.imagen }} style={[styles.imagen, estaVendida && styles.imagenVendida]} resizeMode="contain" />
                            </View>
                        )}
                        titleStyle={[styles.titulo, estaVendida && styles.tituloVendida]}
                        descriptionStyle={styles.descripcion}
                        contentStyle={styles.contenido}
                    />
                    <Divider />
                </View>
            );
        };

        // Ponemos filtros del control de flujo
        if (this.props.camisetas.isLoading) return <IndicadorActividad />;
        if (this.props.camisetas.errMess) return <View style={styles.errorContainer}><Text>{this.props.camisetas.errMess}</Text></View>;

        const camisetasFiltradas = this.props.camisetas.camisetas.filter(camiseta => { // Llevamos aqui el filtrado completo
            const nombre = camiseta.nombres?.[i18n.language] || camiseta.nombres?.['es'] || camiseta.nombre || '';
            
            const coincideModo = esSegundaMano 
                ? camiseta.estado === 'usada' 
                : camiseta.estado === 'nueva';
            
            const coincideBusqueda = nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
            const esDisponible = esSegundaMano ? (camiseta.estadoVenta !== 'vendida') : true;
            const coincidePais = esSegundaMano || filtros.pais === '' || camiseta.pais === filtros.pais;
            const coincideEquipo = esSegundaMano || filtros.equipo === '' || camiseta.equipo === filtros.equipo;
            const coincideTalla = esSegundaMano || filtros.talla === '' || camiseta.talla === filtros.talla;

            return coincideModo && coincideBusqueda && coincidePais && coincideEquipo && coincideTalla && esDisponible;
        });

        return (
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
                    <Chip selected={!esSegundaMano} onPress={() => this.cambiarModo('tienda')} style={{ marginHorizontal: 5 }}>{t('catalogoComponent.tienda_oficial')}</Chip>
                    <Chip selected={esSegundaMano} onPress={() => this.cambiarModo('segunda_mano')} style={{ marginHorizontal: 5 }}>{t('catalogoComponent.segunda_mano')}</Chip>
                </View>

                <Searchbar placeholder={t('catalogoComponent.buscar_placeholder')} onChangeText={(t) => this.setState({ textoBusqueda: t })} value={textoBusqueda} style={styles.searchbar} />

                {!esSegundaMano && (
                    <List.Accordion title={t('catalogoComponent.filtrar_titulo')} left={p => <List.Icon {...p} icon="filter-variant" />} expanded={expanded} onPress={this.handlePressAcordeon} style={styles.acordeon}>
                        <View style={styles.contenedorFiltros}>
                        </View>
                    </List.Accordion>
                )}

                <FlatList data={camisetasFiltradas} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imagenContainer: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
    imagen: { width: 75, height: 75, borderRadius: 4 },
    imagenVendida: { opacity: 0.5 },
    titulo: { fontSize: 16, fontWeight: 'bold' },
    tituloVendida: { color: '#999' },
    contenido: { paddingVertical: 10 },
    descripcion: { fontSize: 13, color: '#666' },
    searchbar: { marginHorizontal: 10, marginTop: 10, backgroundColor: '#f0f0f0' },
    acordeon: { backgroundColor: '#f8f8f8' }
});

export default withTranslation()(connect(mapStateToProps)(Catalogo));