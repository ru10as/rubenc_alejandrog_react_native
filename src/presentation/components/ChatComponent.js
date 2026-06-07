import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // IMPORTANTE
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    collection, doc, setDoc, addDoc, query, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../api/firebaseConfig';

const ChatComponent = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { chatId, compradorId, compradorNombre, vendedorId, vendedorNombre, camiseta } = route.params;
    const usuario = useSelector((state) => state.usuario?.user);
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const soyVendedor = usuario?.uid === vendedorId;
    const nombreOtro = soyVendedor ? compradorNombre : vendedorNombre;
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState('');
    const listaRef = useRef(null);

    useEffect(() => {
        if (nombreOtro) navigation.setOptions({ title: nombreOtro });
    }, [navigation, nombreOtro]);

    useEffect(() => {
        const q = query(
            collection(db, 'chats', chatId, 'mensajes'),
            orderBy('fecha', 'asc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMensajes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return unsubscribe;
    }, [chatId]);

    const enviarMensaje = async () => {
        const contenido = texto.trim();
        if (!contenido || !usuario?.uid) return;
        setTexto('');
        try {
            await setDoc(doc(db, 'chats', chatId), {
                participantes: [compradorId, vendedorId],
                compradorId, compradorNombre, vendedorId, vendedorNombre,
                camisetaId: camiseta?.id, camisetaNombre: camiseta?.nombre, camisetaImagen: camiseta?.imagen,
                ultimoMensaje: contenido, ultimoAutorId: usuario.uid, ultimaFecha: serverTimestamp(),
            }, { merge: true });

            await addDoc(collection(db, 'chats', chatId, 'mensajes'), {
                texto: contenido, autorId: usuario.uid, fecha: serverTimestamp(),
            });
        } catch (error) { console.error('Error:', error); }
    };

    const renderMensaje = ({ item }) => {
        const esMio = item.autorId === usuario?.uid;
        return (
            <View style={[styles.burbuja, esMio ? styles.burbujaMia : styles.burbujaSuya]}>
                <Text style={esMio ? styles.textoMio : styles.textoSuyo}>{item.texto}</Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={headerHeight}
        >
            <FlatList
                ref={listaRef}
                data={mensajes}
                renderItem={renderMensaje}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.lista}
                onContentSizeChange={() => listaRef.current?.scrollToEnd({ animated: true })}
                ListEmptyComponent={<Text style={styles.vacio}>{t('chat.vacio')}</Text>}
            />

            <View style={[styles.barraInput, { paddingBottom: Math.max(insets.bottom, 6) }]}>
                <TextInput
                    style={styles.input}
                    mode="outlined"
                    dense
                    placeholder={t('chat.placeholder')}
                    value={texto}
                    onChangeText={setTexto}
                    multiline
                />
                <IconButton
                    icon="send"
                    mode="contained"
                    onPress={enviarMensaje}
                    disabled={!texto.trim()}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    lista: { padding: 12, flexGrow: 1 },
    vacio: { textAlign: 'center', color: '#999', marginTop: 30 },
    burbuja: { maxWidth: '78%', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, marginVertical: 4 },
    burbujaMia: { alignSelf: 'flex-end', backgroundColor: '#6200ee', borderBottomRightRadius: 4 },
    burbujaSuya: { alignSelf: 'flex-start', backgroundColor: '#eceff1', borderBottomLeftRadius: 4 },
    textoMio: { color: '#fff' },
    textoSuyo: { color: '#222' },
    barraInput: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 8,
        paddingTop: 6,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: { 
        flex: 1, 
        maxHeight: 120, 
        backgroundColor: '#fff',
        textAlignVertical: 'center',
        paddingTop: 10,
        paddingBottom: 0,
        paddingHorizontal: 12,
    },
});

export default ChatComponent;