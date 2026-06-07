import React, { Component } from 'react';
import { FlatList, View, Image, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, Divider, Text, Searchbar, Chip } from 'react-native-paper';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { IndicadorActividad } from './IndicadorActividadComponent';
import { esProductoSegundaMano } from '../../comun/comun';

const mapStateToProps = state => ({
    camisetas: state.camisetas,
});

const mapDispatchToProps = dispatch => ({
    fetchCamisetas: () => dispatch(fetchCamisetas())
});

class Catalogo extends Component {
    constructor(props) {
        super(props);
        const params = props.route?.params || {};
        this.state = {
            textoBusqueda: '', // Vacio para antes de que empiece a escribir
            expanded: false, // Para el panel de filtros
            filtros: {
                modo: params.modoInicial || 'tienda',
                pais: '',
                equipo: '',
                talla: '',
                soloRetro: !!params.soloRetro,       // Acceso rápido "Retro" desde el Inicio
                soloSeleccion: !!params.soloSeleccion, // Acceso rápido "Selecciones" desde el Inicio
            }
        };
    }

    // Si se vuelve a entrar al Catálogo con otros parámetros (otro acceso rápido), resincronizamos
    componentDidUpdate(prevProps) {
        const prev = prevProps.route?.params || {};
        const cur = this.props.route?.params || {};
        if (prev.modoInicial !== cur.modoInicial || prev.soloRetro !== cur.soloRetro || prev.soloSeleccion !== cur.soloSeleccion) {
            this.setState({
                filtros: {
                    modo: cur.modoInicial || 'tienda',
                    pais: '', equipo: '', talla: '',
                    soloRetro: !!cur.soloRetro,
                    soloSeleccion: !!cur.soloSeleccion,
                }
            });
        }
    }

    // Filtros de valor único (país/equipo/talla): si pulsas el ya seleccionado, lo limpias
    gestionarFiltro = (categoria, valor) => {
        this.setState(prevState => ({
            filtros: {
                ...prevState.filtros,
                [categoria]: prevState.filtros[categoria] === valor ? '' : valor
            }
        }));
    };

    // Tags booleanos (Retro / Selecciones), independientes de la mano
    toggleTag = (key) => {
        this.setState(prevState => ({
            filtros: { ...prevState.filtros, [key]: !prevState.filtros[key] }
        }));
    };

    // Cuando pasamos de un modo a otro, limpiamos todo lo demas
    // Solo cambia la "mano"; los filtros (país/equipo/talla/tags) son independientes y se conservan
    cambiarModo = (nuevoModo) => {
        this.setState(prevState => ({
            filtros: { ...prevState.filtros, modo: nuevoModo }
        }));
    };

    // Es un interruptor lógico que invierte el estado actual (
    handlePressAcordeon = () => {
        this.setState(prevState => ({ expanded: !prevState.expanded }));
    };

    render() {
        const { navigate } = this.props.navigation; // Para movernos entre pantallas
        const { t, i18n } = this.props;
        const { textoBusqueda, filtros, expanded } = this.state;

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
                        onPress={() => !estaVendida && (esProductoSegundaMano(item) ? navigate('DetalleCamisetaSMano', { camiseta: item }) : navigate('DetalleCamiseta', { camisetaId: item.id }))}
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

        const todasLasCamisetas = this.props.camisetas.camisetas || [];

        // Valores únicos para construir los chips de filtro a partir de los datos reales
        const paises = [...new Set(todasLasCamisetas.map(c => c.pais).filter(Boolean))];
        const equipos = [...new Set(todasLasCamisetas.map(c => c.equipo).filter(Boolean))];
        const tallas = [...new Set(todasLasCamisetas.flatMap(c => c.tallas || []).filter(Boolean))];

        const camisetasFiltradas = todasLasCamisetas.filter(camiseta => { // Llevamos aqui el filtrado completo
            const nombre = camiseta.nombres?.[i18n.language] || camiseta.nombres?.['es'] || camiseta.nombre || '';
            const esSegunda = esProductoSegundaMano(camiseta); // oficial vs segunda según creadoPor

            const coincideMano =
                filtros.modo === 'todas' ? true :
                filtros.modo === 'segunda_mano' ? esSegunda :
                !esSegunda; // 'tienda' (oficial)

            const coincideRetro = !filtros.soloRetro || camiseta.esRetro;
            const coincideSeleccion = !filtros.soloSeleccion || camiseta.esSeleccion;
            const coincideBusqueda = nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
            const coincidePais = filtros.pais === '' || camiseta.pais === filtros.pais;
            const coincideEquipo = filtros.equipo === '' || camiseta.equipo === filtros.equipo;
            const coincideTalla = filtros.talla === '' || (camiseta.tallas || []).includes(filtros.talla);
            const esDisponible = !esSegunda || camiseta.estadoVenta !== 'vendida'; // ocultar vendidas de usuarios

            return coincideMano && coincideRetro && coincideSeleccion && coincideBusqueda && coincidePais && coincideEquipo && coincideTalla && esDisponible;
        });

        const grupoFiltro = (label, valores, categoria) => (
            valores.length > 0 && (
                <View style={styles.grupoFiltro}>
                    <Text style={styles.filtroLabel}>{label}</Text>
                    <View style={styles.chipsWrap}>
                        {valores.map(v => (
                            <Chip
                                key={v}
                                compact
                                selected={filtros[categoria] === v}
                                onPress={() => this.gestionarFiltro(categoria, v)}
                                style={styles.filtroChip}
                            >
                                {v}
                            </Chip>
                        ))}
                    </View>
                </View>
            )
        );

        return (
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
                    <Chip selected={filtros.modo === 'tienda'} onPress={() => this.cambiarModo('tienda')} style={{ marginHorizontal: 4 }}>{t('catalogoComponent.tienda_oficial')}</Chip>
                    <Chip selected={filtros.modo === 'segunda_mano'} onPress={() => this.cambiarModo('segunda_mano')} style={{ marginHorizontal: 4 }}>{t('catalogoComponent.segunda_mano')}</Chip>
                    <Chip selected={filtros.modo === 'todas'} onPress={() => this.cambiarModo('todas')} style={{ marginHorizontal: 4 }}>{t('catalogoComponent.todas')}</Chip>
                </View>

                <Searchbar placeholder={t('catalogoComponent.buscar_placeholder')} onChangeText={(t) => this.setState({ textoBusqueda: t })} value={textoBusqueda} style={styles.searchbar} />

                <List.Accordion title={t('catalogoComponent.filtrar_titulo')} left={p => <List.Icon {...p} icon="filter-variant" />} expanded={expanded} onPress={this.handlePressAcordeon} style={styles.acordeon}>
                    <View style={styles.contenedorFiltros}>
                        {grupoFiltro(t('catalogoComponent.filtro_pais'), paises, 'pais')}
                        {grupoFiltro(t('catalogoComponent.filtro_equipo'), equipos, 'equipo')}
                        {grupoFiltro(t('catalogoComponent.filtro_talla'), tallas, 'talla')}
                        <View style={styles.grupoFiltro}>
                            <Text style={styles.filtroLabel}>{t('catalogoComponent.filtro_etiquetas')}</Text>
                            <View style={styles.chipsWrap}>
                                <Chip compact icon="history" selected={filtros.soloRetro} onPress={() => this.toggleTag('soloRetro')} style={styles.filtroChip}>{t('catalogoComponent.filtro_retro')}</Chip>
                                <Chip compact icon="flag-outline" selected={filtros.soloSeleccion} onPress={() => this.toggleTag('soloSeleccion')} style={styles.filtroChip}>{t('catalogoComponent.filtro_seleccion')}</Chip>
                            </View>
                        </View>
                    </View>
                </List.Accordion>

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
    acordeon: { backgroundColor: '#f8f8f8' },
    contenedorFiltros: { paddingHorizontal: 14, paddingBottom: 12, backgroundColor: '#f8f8f8' },
    grupoFiltro: { marginTop: 10 },
    filtroLabel: { fontSize: 13, fontWeight: 'bold', color: '#555', marginBottom: 6 },
    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
    filtroChip: { marginRight: 6, marginBottom: 6 },
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Catalogo));