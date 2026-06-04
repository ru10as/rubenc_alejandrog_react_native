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
            textoBusqueda: '',
            expanded: false,
            filtros: {
                modo: 'tienda', 
                pais: '',
                equipo: '',
                talla: '',
            }
        };
    }

    gestionarFiltro = (categoria, valor) => {
        this.setState(prevState => ({
            filtros: {
                ...prevState.filtros,
                [categoria]: prevState.filtros[categoria] === valor ? '' : valor
            }
        }));
    };

    cambiarModo = (nuevoModo) => {
        // Al cambiar de modo, reseteamos todos los filtros
        this.setState({
            filtros: { modo: nuevoModo, pais: '', equipo: '', talla: '' }
        });
    };

    handlePressAcordeon = () => {
        this.setState(prevState => ({ expanded: !prevState.expanded }));
    };

    render() {
        const { navigate } = this.props.navigation;
        const { t, i18n } = this.props;
        const { textoBusqueda, filtros, expanded } = this.state;
        const esSegundaMano = filtros.modo === 'segunda_mano';

        const renderItem = ({ item }) => {
            const nombreTraducido = item.nombres?.[i18n.language] || item.nombres?.['es'] || item.nombre;
            const descripcionTraducida = item.descripciones?.[i18n.language] || item.descripciones?.['es'] || item.descripcion;

            return (
                <View>
                    <List.Item
                        title={nombreTraducido}
                        description={descripcionTraducida}
                        titleNumberOfLines={0}
                        descriptionNumberOfLines={2}
                        onPress={() => item.estado === 'usada' ? navigate('DetalleCamisetaSMano', { camiseta: item }) : navigate('DetalleCamiseta', { camisetaId: item.id })}
                        left={() => (
                            <View style={styles.imagenContainer}>
                                <Image source={{ uri: item.imagen }} style={styles.imagen} resizeMode="contain" />
                            </View>
                        )}
                        titleStyle={styles.titulo}
                        descriptionStyle={styles.descripcion}
                        contentStyle={styles.contenido}
                    />
                    <Divider />
                </View>
            );
        };

        if (this.props.camisetas.isLoading) return <IndicadorActividad />;
        if (this.props.camisetas.errMess) return <View style={styles.errorContainer}><Text>{this.props.camisetas.errMess}</Text></View>;

        const camisetasFiltradas = this.props.camisetas.camisetas.filter(camiseta => {
            const nombre = camiseta.nombres?.[i18n.language] || camiseta.nombres?.['es'] || camiseta.nombre || '';
            
            const coincideModo = esSegundaMano 
                ? camiseta.estado === 'usada' 
                : camiseta.estado === 'nueva';
            
            const coincideBusqueda = nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
            
            // Los filtros de pais/equipo/talla solo se aplican en la Tienda Oficial
            const coincidePais = esSegundaMano || filtros.pais === '' || camiseta.pais === filtros.pais;
            const coincideEquipo = esSegundaMano || filtros.equipo === '' || camiseta.equipo === filtros.equipo;
            const coincideTalla = esSegundaMano || filtros.talla === '' || camiseta.talla === filtros.talla;

            return coincideModo && coincideBusqueda && coincidePais && coincideEquipo && coincideTalla;
        });

        const opPaises = ['España', 'Inglaterra', 'Italia', 'Francia'];
        const opEquipos = ['Real Madrid', 'Barcelona', 'Liverpool', 'Man City', 'Juventus'];
        const opTallas = ['S', 'M', 'L', 'XL'];

        return (
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
                    <Chip selected={!esSegundaMano} onPress={() => this.cambiarModo('tienda')} style={{ marginHorizontal: 5 }}>{t('catalogoComponent.tienda_oficial')}</Chip>
                    <Chip selected={esSegundaMano} onPress={() => this.cambiarModo('segunda_mano')} style={{ marginHorizontal: 5 }}>{t('catalogoComponent.segunda_mano')}</Chip>
                </View>

                <Searchbar placeholder={t('catalogoComponent.buscar_placeholder')} onChangeText={(t) => this.setState({ textoBusqueda: t })} value={textoBusqueda} style={styles.searchbar} />

                {/* Filtros solo visibles en Tienda Oficial */}
                {!esSegundaMano && (
                    <List.Accordion title={t('catalogoComponent.filtrar_titulo')} left={p => <List.Icon {...p} icon="filter-variant" />} expanded={expanded} onPress={this.handlePressAcordeon} style={styles.acordeon}>
                        <View style={styles.contenedorFiltros}>
                            <Text style={styles.tituloFiltro}>{t('catalogoComponent.filtro_pais')}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {opPaises.map(p => <Chip key={p} selected={filtros.pais === p} onPress={() => this.gestionarFiltro('pais', p)} style={styles.chip}>{p}</Chip>)}
                            </ScrollView>
                            <Text style={styles.tituloFiltro}>{t('catalogoComponent.filtro_equipo')}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {opEquipos.map(e => <Chip key={e} selected={filtros.equipo === e} onPress={() => this.gestionarFiltro('equipo', e)} style={styles.chip}>{e}</Chip>)}
                            </ScrollView>
                            <Text style={styles.tituloFiltro}>{t('catalogoComponent.filtro_talla')}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {opTallas.map(t => <Chip key={t} selected={filtros.talla === t} onPress={() => this.gestionarFiltro('talla', t)} style={styles.chip}>{t}</Chip>)}
                            </ScrollView>
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
    contenido: { paddingVertical: 10 },
    titulo: { fontSize: 16, fontWeight: 'bold' },
    descripcion: { fontSize: 13, color: '#666' },
    searchbar: { marginHorizontal: 10, marginTop: 10, backgroundColor: '#f0f0f0' },
    contenedorFiltros: { paddingHorizontal: 10, paddingVertical: 5 },
    tituloFiltro: { fontSize: 12, fontWeight: 'bold', color: '#888', marginTop: 8 },
    chip: { marginRight: 6, height: 30, marginBottom: 5 },
    acordeon: { backgroundColor: '#f8f8f8' }
});

export default withTranslation()(connect(mapStateToProps)(Catalogo));