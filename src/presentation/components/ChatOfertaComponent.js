import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { enviarMensaje,suscribirseAMensajes } from '../../redux/ActionCreators';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
    usuario: state.usuario?.user,
});

const mapDispatchToProps = (dispatch) => ({
    enviarMensaje: (oferta, contenido, uid) => dispatch(enviarMensaje(oferta, contenido, uid)),
});

const ChatOfertaComponent = ({ route, navigation, usuario, enviarMensaje }) => { 
    const { t } = useTranslation();
    const { oferta } = route.params; 
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState('');
    const listaRef = useRef(null);

    useEffect(() => {
        if (oferta.nombreComprador) navigation.setOptions({ title: oferta.nombreComprador });
    }, [navigation, oferta.nombreComprador]);

    useEffect(() => {
        const unsubscribe = suscribirseAMensajes(oferta.id, (mensajesActualizados) => {
            setMensajes(mensajesActualizados);
        });
        return unsubscribe;
    }, [oferta.id]);

    const handleEnviarMensaje = async () => {
        const contenido = texto.trim();
        if (!contenido || !usuario?.uid) return;
        setTexto('');
        enviarMensaje(oferta, contenido, usuario.uid);
    };

    const renderMensaje = ({ item }) => { // Para indicar como se dibuja cada mensaje en pantalla
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
                    onPress={handleEnviarMensaje}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatOfertaComponent);