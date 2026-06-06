import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, Avatar, Text, Surface, IconButton, ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { 
    collection, query, where, onSnapshot, doc, updateDoc, 
    writeBatch, getDocs 
} from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { db } from '../../api/firebaseConfig';
import { colorTiendaOscuro } from '../../comun/comun';

const MisVentasComponent = ({ navigation }) => {
    const { t } = useTranslation();
    const usuario = useSelector((state) => state.usuario?.user);
    const [misCamisetas, setMisCamisetas] = useState([]);
    const [ofertasRecibidas, setOfertasRecibidas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!usuario?.uid) return;

        const qCamisetas = query(
            collection(db, "camisetas"), 
            where("vendedorId", "==", usuario.uid)
        );
        
        const unsubCamisetas = onSnapshot(qCamisetas, (snap) => {
            setMisCamisetas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setCargando(false);
        });

        const qOfertas = query(collection(db, "ofertas"), where("vendedorId", "==", usuario.uid));
        const unsubOfertas = onSnapshot(qOfertas, (snap) => {
            setOfertasRecibidas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => { unsubCamisetas(); unsubOfertas(); };
    }, [usuario]);

    const actualizarEstado = async (oferta, nuevoEstado) => {
        try {
            const batch = writeBatch(db);
            
            if (nuevoEstado === 'aceptada') {
                batch.update(doc(db, "ofertas", oferta.id), { estado: 'aceptada' });
                batch.update(doc(db, "camisetas", oferta.camisetaId), { estadoVenta: 'vendida' });

                const q = query(
                    collection(db, "ofertas"),
                    where("camisetaId", "==", oferta.camisetaId),
                    where("estado", "==", "pendiente")
                );
                const snapshot = await getDocs(q);
                snapshot.docs.forEach((d) => {
                    if (d.id !== oferta.id) {
                        batch.update(d.ref, { estado: 'rechazada' });
                    }
                });
            } else {
                batch.update(doc(db, "ofertas", oferta.id), { estado: nuevoEstado });
            }
            
            await batch.commit();
        } catch (e) {
            console.error("Error al gestionar la oferta:", e);
        }
    };

    const renderCamiseta = ({ item }) => {
        const ofertasDeEsteProducto = ofertasRecibidas.filter(o => o.camisetaId === item.id);
        
        if (item.estadoVenta === 'vendida') {
            return null;
        }

        return (
            <Surface style={styles.itemCard} elevation={1}>
                <List.Accordion
                    title={item.nombres?.es || item.nombres?.en || 'Camiseta'}
                    description={`${item.precio}€`}
                    left={props => <Avatar.Image {...props} size={50} source={{ uri: item.imagen }} />}
                    style={styles.acordeon}
                >
                    {ofertasDeEsteProducto.map(oferta => (
                        <View key={oferta.id} style={styles.ofertaRow}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.nombreUsuario}>{oferta.nombreComprador || "Usuario"}</Text>
                                <Text style={styles.montoTexto}>{oferta.monto}€ · {t(`estado.${oferta.estado || 'pendiente'}`)}</Text>
                            </View>
                            
                            <View style={styles.botonesContainer}>
                                {oferta.estado === 'pendiente' && (
                                    <>
                                        <IconButton icon="check" iconColor="#4CAF50" size={22} onPress={() => actualizarEstado(oferta, 'aceptada')} />
                                        <IconButton icon="close" iconColor="#F44336" size={22} onPress={() => actualizarEstado(oferta, 'rechazada')} />
                                    </>
                                )}
                                <IconButton 
                                    icon="chat" 
                                    iconColor="#2196F3" 
                                    size={22} 
                                    onPress={() => navigation.navigate('ChatOferta', { oferta: oferta })} 
                                />
                            </View>
                        </View>
                    ))}
                </List.Accordion>
            </Surface>
        );
    };

    if (cargando) return <ActivityIndicator style={styles.centered} size="large" color={colorTiendaOscuro} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={misCamisetas}
                renderItem={renderCamiseta}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.lista}
                ListEmptyComponent={<Text style={styles.vacioTexto}>{t('ventas.vacio')}</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    lista: { padding: 10 },
    vacioTexto: { textAlign: 'center', marginTop: 50, color: '#999' },
    itemCard: { marginBottom: 10, borderRadius: 8, backgroundColor: '#fff', overflow: 'hidden' },
    acordeon: { backgroundColor: '#fff' },
    ofertaRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: 8, 
        paddingHorizontal: 16, 
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    infoContainer: { flex: 1 },
    nombreUsuario: { fontWeight: 'bold', fontSize: 14 },
    montoTexto: { fontSize: 12, color: '#666' },
    botonesContainer: { flexDirection: 'row', alignItems: 'center' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default MisVentasComponent;