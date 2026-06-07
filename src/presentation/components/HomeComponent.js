import React from 'react';
import { ScrollView, View, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { baseUrl, colorTiendaOscuro, colorTiendaAcento, esProductoSegundaMano } from '../../comun/comun';
import { IndicadorActividad } from './IndicadorActividadComponent';

// Resuelve la imagen tanto si viene como URL absoluta (Firebase) como relativa (json-server)
const uriDe = (img) => (img?.startsWith('http') ? img : baseUrl + img);

// Navega al detalle correcto: oficial -> comprar, de usuario -> chat/oferta (según creadoPor)
const irADetalle = (navigation, item) => {
    if (esProductoSegundaMano(item)) {
        navigation.navigate('DetalleCamisetaSMano', { camiseta: item });
    } else {
        navigation.navigate('DetalleCamiseta', { camisetaId: item.id });
    }
};

function TarjetaProducto({ item, lang, onPress }) {
    const nombre = item.nombres?.[lang] || item.nombres?.['es'] || item.nombre;
    return (
        <TouchableOpacity style={styles.prodCard} onPress={onPress} activeOpacity={0.85}>
            <Image source={{ uri: uriDe(item.imagen) }} style={styles.prodImg} resizeMode="cover" />
            <View style={styles.prodInfo}>
                <Text numberOfLines={1} style={styles.prodNombre}>{nombre}</Text>
                {item.precio != null && (
                    <Text style={styles.prodPrecio}>{Number(item.precio).toFixed(2)} €</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

function Seccion({ titulo, icono, data, lang, navigation, verTodoLabel, onVerTodo }) {
    if (!data?.length) return null;
    return (
        <View style={styles.seccion}>
            <View style={styles.seccionHeader}>
                <View style={styles.seccionTituloWrap}>
                    <MaterialCommunityIcons name={icono} size={20} color={colorTiendaAcento} />
                    <Text style={styles.seccionTitulo}>{titulo}</Text>
                </View>
                {onVerTodo && (
                    <TouchableOpacity onPress={onVerTodo} hitSlop={8}>
                        <Text style={styles.verTodo}>{verTodoLabel} ›</Text>
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                horizontal
                data={data}
                keyExtractor={(item) => String(item.id)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listaContent}
                renderItem={({ item }) => (
                    <TarjetaProducto item={item} lang={lang} onPress={() => irADetalle(navigation, item)} />
                )}
            />
        </View>
    );
}

export default function Home({ navigation }) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const camisetasState = useSelector((state) => state.camisetas);
    const usuario = useSelector((state) => state.usuario?.user);

    if (camisetasState?.isLoading) return <IndicadorActividad />;
    if (camisetasState?.errMess) {
        return <View style={styles.error}><Text>{camisetasState.errMess}</Text></View>;
    }

    const camisetas = camisetasState?.camisetas || [];

    const destacadas = camisetas.filter((c) => c.destacado);
    const selecciones = camisetas.filter((c) => c.esSeleccion);
    const retro = camisetas.filter((c) => c.esRetro);

    const irACatalogo = (params) => navigation.navigate('Camisetas', { screen: 'Catalogo', params });

    const accesos = [
        { key: 'oficial', icon: 'storefront-outline', label: t('homeComponent.acceso_oficial'), params: { modoInicial: 'tienda' } },
        { key: 'segunda', icon: 'recycle', label: t('homeComponent.acceso_segunda'), params: { modoInicial: 'segunda_mano' } },
        { key: 'retro', icon: 'history', label: t('homeComponent.acceso_retro'), params: { modoInicial: 'todas', soloRetro: true } },
        { key: 'selecciones', icon: 'flag-outline', label: t('homeComponent.acceso_selecciones'), params: { modoInicial: 'todas', soloSeleccion: true } },
    ];

    const nombreUsuario = usuario?.displayName || usuario?.email?.split('@')[0];

    return (
        <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
            {nombreUsuario && (
                <Text style={styles.saludo}>{t('homeComponent.saludo', { nombre: nombreUsuario })}</Text>
            )}

            {/* ACCESOS RÁPIDOS */}
            <View style={styles.accesosRow}>
                {accesos.map((a) => (
                    <TouchableOpacity key={a.key} style={styles.acceso} onPress={() => irACatalogo(a.params)} activeOpacity={0.7}>
                        <View style={styles.accesoIcono}>
                            <MaterialCommunityIcons name={a.icon} size={24} color={colorTiendaOscuro} />
                        </View>
                        <Text style={styles.accesoLabel} numberOfLines={1}>{a.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* CARRUSELES */}
            <Seccion
                titulo={t('homeComponent.destacados')}
                icono="star"
                data={destacadas}
                lang={lang}
                navigation={navigation}
                verTodoLabel={t('homeComponent.ver_todo')}
                onVerTodo={() => navigation.navigate('Camisetas')}
            />

            <Seccion
                titulo={t('homeComponent.selecciones')}
                icono="flag"
                data={selecciones}
                lang={lang}
                navigation={navigation}
                verTodoLabel={t('homeComponent.ver_todo')}
                onVerTodo={() => irACatalogo({ modoInicial: 'todas', soloSeleccion: true })}
            />

            <Seccion
                titulo={t('homeComponent.coleccion_retro')}
                icono="history"
                data={retro}
                lang={lang}
                navigation={navigation}
                verTodoLabel={t('homeComponent.ver_todo')}
                onVerTodo={() => irACatalogo({ modoInicial: 'todas', soloRetro: true })}
            />

            {/* CTA: vender */}
            <TouchableOpacity style={styles.vendeCard} activeOpacity={0.9} onPress={() => navigation.navigate('Publicar Producto')}>
                <View style={styles.vendeTexto}>
                    <Text style={styles.vendeTitulo}>{t('homeComponent.vende_titulo')}</Text>
                    <Text style={styles.vendeSubtitulo}>{t('homeComponent.vende_subtitulo')}</Text>
                </View>
                <View style={styles.vendeBoton}>
                    <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                    <Text style={styles.vendeBotonTexto}>{t('homeComponent.vende_boton')}</Text>
                </View>
            </TouchableOpacity>

            <View style={{ height: 24 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: '#f5f5f5' },
    error: { padding: 20, alignItems: 'center' },

    saludo: { fontSize: 20, fontWeight: 'bold', color: colorTiendaOscuro, marginHorizontal: 16, marginTop: 20, marginBottom: 8 },

    // Accesos rápidos
    accesosRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 8, marginTop: 12, marginBottom: 16 },
    acceso: { alignItems: 'center', flex: 1 },
    accesoIcono: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, borderWidth: 1, borderColor: '#eee' },
    accesoLabel: { fontSize: 12, color: colorTiendaOscuro, marginTop: 6, fontWeight: '600' },

    // Secciones / carruseles
    seccion: { marginTop: 24 },
    seccionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 },
    seccionTituloWrap: { flexDirection: 'row', alignItems: 'center' },
    seccionTitulo: { fontSize: 17, fontWeight: 'bold', color: colorTiendaOscuro, marginLeft: 6 },
    verTodo: { fontSize: 13, color: colorTiendaAcento, fontWeight: '600' },
    listaContent: { paddingHorizontal: 12 },

    // Tarjeta de producto
    prodCard: { width: 150, backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 4, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    prodImg: { width: '100%', height: 130, backgroundColor: '#eee' },
    prodInfo: { padding: 10 },
    prodNombre: { fontSize: 14, fontWeight: '600', color: '#333' },
    prodPrecio: { fontSize: 15, fontWeight: 'bold', color: colorTiendaAcento, marginTop: 4 },

    // CTA vender
    vendeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colorTiendaOscuro, marginHorizontal: 12, marginTop: 20, borderRadius: 14, padding: 16 },
    vendeTexto: { flex: 1, paddingRight: 10 },
    vendeTitulo: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    vendeSubtitulo: { color: '#cdd5dd', fontSize: 13, marginTop: 2 },
    vendeBoton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colorTiendaAcento, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
    vendeBotonTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginLeft: 4 },
});
