import { Component } from 'react';
import { FlatList, View, Image, StyleSheet, ScrollView } from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, Divider, Text, Searchbar, Chip } from 'react-native-paper'; 
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { IndicadorActividad } from './IndicadorActividadComponent';
import { baseUrl } from '../../comun/comun';
import DetalleCamisetaSMano from './DetalleCamisetaSMano';

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
        this.setState(prevState => ({
            filtros: {
                ...prevState.filtros,
                modo: nuevoModo
            }
        }));
    };

    handlePressAcordeon = () => {
        this.setState(prevState => ({ expanded: !prevState.expanded }));
    };

    render() {
        const { navigate } = this.props.navigation;
        const { t, i18n } = this.props; 
        const { textoBusqueda, filtros, expanded } = this.state; 

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
                        onPress={() => {
                            // Aqui es donde el identificador (vendedorId) decide el destino
                            if (item.vendedorId) {
                                // Va a la pantalla de Segunda Mano
                                navigate('DetalleCamisetaSMano', { camiseta: item });
                            } else {
                                // Va a la pantalla de Tienda Oficial (la original)
                                navigate('DetalleCamiseta', { camisetaId: item.id });
                            }
                        }}
                        left={() => (
                            <View style={styles.imagenContainer}>
                                <Image
                                    source={{ uri: item.imagen }}
                                    style={styles.imagen}
                                    resizeMode="contain" 
                                />
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

        if (this.props.camisetas.isLoading) {
            return <IndicadorActividad />;
        }
        
        if (this.props.camisetas.errMess) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{this.props.camisetas.errMess}</Text>
                </View>
            );
        }

        const camisetasFiltradas = this.props.camisetas.camisetas.filter(camiseta => {
            const nombre = camiseta.nombres?.[i18n.language] || camiseta.nombres?.['es'] || camiseta.nombre || '';
            
            const coincideModo = filtros.modo === 'tienda' 
                ? !camiseta.vendedorId 
                : !!camiseta.vendedorId;

            const coincideBusqueda = nombre.toLowerCase().includes(textoBusqueda.toLowerCase());
            const coincidePais = filtros.pais === '' || camiseta.pais === filtros.pais;
            const coincideEquipo = filtros.equipo === '' || camiseta.equipo === filtros.equipo;
            const coincideTalla = filtros.talla === '' || camiseta.talla === filtros.talla;

            return coincideModo && coincideBusqueda && coincidePais && coincideEquipo && coincideTalla;
        });

        // Listas de opciones disponibles (Modifica estos arrays según lo que tengas en tu base de datos)
        const opcionesPaises = ['España', 'Inglaterra', 'Italia', 'Francia'];
        const opcionesEquipos = ['Real Madrid', 'Barcelona', 'Liverpool', 'Man City', 'Juventus'];
        const opcionesTallas = ['S', 'M', 'L', 'XL'];

        // Esto a continuacion para ponerle un breve titulo a lo que es el Acordeon con el filtrado
        const textoTituloAcordeon = 'Filtrar por categorías';

        

        return (
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                
                <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
                    <Chip 
                        selected={filtros.modo === 'tienda'} 
                        onPress={() => this.cambiarModo('tienda')}
                        style={{ marginHorizontal: 5 }}
                    >Tienda Oficial</Chip>
                    <Chip 
                        selected={filtros.modo === 'segunda_mano'} 
                        onPress={() => this.cambiarModo('segunda_mano')}
                        style={{ marginHorizontal: 5 }}
                    >Segunda Mano</Chip>
                </View>

                {/* BUSCADOR PRINCIPAL */}
                <Searchbar
                    placeholder="Buscar camiseta..."
                    onChangeText={(texto) => this.setState({ textoBusqueda: texto })}
                    value={textoBusqueda}
                    style={styles.searchbar}
                />

                <List.Accordion
                    title={textoTituloAcordeon}
                    left={props => <List.Icon {...props} icon="filter-variant" />}
                    expanded={expanded}
                    onPress={this.handlePressAcordeon}
                    style={styles.acordeon}
                    titleStyle={styles.acordeonTitulo}
                >

                    {/* CONTENEDOR GENERAL DE TODOS LOS FILTROS */}
                    <View style={styles.contenedorFiltros}>
                        
                        {/* FILTRO 1: PAÍSES */}
                        <Text style={styles.tituloFiltro}>País</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollFiltros}>
                            {opcionesPaises.map(pais => (
                                <Chip
                                    key={pais}
                                    selected={filtros.pais === pais}
                                    onPress={() => this.gestionarFiltro('pais', pais)}
                                    style={styles.chip}
                                    selectedColor="#fff"
                                    buttonColor={filtros.pais === pais ? '#6200ee' : '#f0f0f0'}
                                >
                                    {pais}
                                </Chip>
                            ))}
                        </ScrollView>

                        {/* FILTRO 2: EQUIPOS */}
                        <Text style={styles.tituloFiltro}>Equipo</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollFiltros}>
                            {opcionesEquipos.map(equipo => (
                                <Chip
                                    key={equipo}
                                    selected={filtros.equipo === equipo}
                                    onPress={() => this.gestionarFiltro('equipo', equipo)}
                                    style={styles.chip}
                                    selectedColor="#fff"
                                    buttonColor={filtros.equipo === equipo ? '#00bcd4' : '#f0f0f0'}
                                >
                                    {equipo}
                                </Chip>
                            ))}
                        </ScrollView>

                        {/* FILTRO 3: TALLAS */}
                        <Text style={styles.tituloFiltro}>Talla</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollFiltros}>
                            {opcionesTallas.map(talla => (
                                <Chip
                                    key={talla}
                                    selected={filtros.talla === talla}
                                    onPress={() => this.gestionarFiltro('talla', talla)}
                                    style={styles.chip}
                                    selectedColor="#fff"
                                    buttonColor={filtros.talla === talla ? '#ff5722' : '#f0f0f0'}
                                >
                                    {talla}
                                </Chip>
                            ))}
                        </ScrollView>
                    </View>
                </List.Accordion>
                {/* LISTA DE RESULTADOS */}
                <FlatList
                    data={camisetasFiltradas} 
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imagenContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    imagen: {
        width: 75,
        height: 75,
        borderRadius: 4,
    },
    contenido: { paddingVertical: 10 },
    titulo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    descripcion: { fontSize: 13, color: '#666' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { color: 'red', textAlign: 'center' },
    searchbar: { marginHorizontal: 10, marginTop: 10, backgroundColor: '#f0f0f0' },
    
    // Estilos de la zona facetada de filtros
    contenedorFiltros: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#fff' },
    tituloFiltro: { fontSize: 12, fontWeight: 'bold', color: '#888', marginTop: 8, marginBottom: 4, textTransform: 'uppercase' },
    scrollFiltros: { paddingRight: 20, paddingBottom: 4 },
    chip: { marginRight: 6, height: 30, justifyContent: 'center' }
});

export default withTranslation()(connect(mapStateToProps)(Catalogo));