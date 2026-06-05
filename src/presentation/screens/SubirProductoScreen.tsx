import React, { useState } from 'react';
import {
    View, ScrollView, StyleSheet, Alert, Image,
    TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { fetchCamisetas } from '../../redux/ActionCreators';
import { db, storage, auth } from '../../api/firebaseConfig';
import { colorTiendaOscuro } from '../../comun/comun';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ANCHO_MAX_IMAGEN = 1024;
const CALIDAD_JPEG = 0.7;

export default function SubirProductoScreen({ navigation }: any) {
    const dispatch = useDispatch(); // Para preparar la conexion con redux
    const [imagen, setImagen] = useState<string | null>(null); // Para guardar la ubicacion local de la foto 
    const [nombreEs, setNombreEs] = useState('');
    const [nombreEn, setNombreEn] = useState('');
    const [nombreEu, setNombreEu] = useState('');
    const [descEs, setDescEs] = useState('');
    const [descEn, setDescEn] = useState('');
    const [descEu, setDescEu] = useState('');
    const [precio, setPrecio] = useState('');
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);

    const abrirSelector = () => {
        Alert.alert('Añadir foto', '¿Desde dónde quieres subir la imagen?', [
            { text: 'Camara', onPress: () => abrirFuente('camara') },
            { text: 'Galería', onPress: () => abrirFuente('galeria') },
            { text: 'Cancelar', style: 'cancel' },
        ]);
    };

    const abrirFuente = async (fuente: 'camara' | 'galeria') => {
        if (fuente === 'camara') {
            const { granted } = await ImagePicker.requestCameraPermissionsAsync(); 
            if (!granted) {
                Alert.alert('Permiso denegado', 'Activa el acceso a la camara en los ajustes.');
                return;
            }
            const resultado = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });
            if (!resultado.canceled) setImagen(resultado.assets[0].uri);
        } else {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) {
                Alert.alert('Permiso denegado', 'Activa el acceso a la galería en los ajustes.');
                return;
            }
            const resultado = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });
            if (!resultado.canceled) setImagen(resultado.assets[0].uri);
        }
    };

    const subirProducto = async () => {
        const usuario = auth.currentUser;
        if (!usuario) return Alert.alert('Sin sesión', 'Debes iniciar sesión para publicar productos.');
        if (!imagen) return Alert.alert('Falta la imagen', 'Selecciona una foto del producto.');
        if (!nombreEs.trim()) return Alert.alert('Nombre obligatorio', 'El nombre en español es obligatorio.');
        if (!descEs.trim()) return Alert.alert('Descripción obligatoria', 'La descripción en español es obligatoria.');
        if (!precio.trim() || isNaN(Number(precio))) return Alert.alert('Precio invalido', 'Introduce un número valido.');

        setSubiendo(true);
        try {
            const imagenOptimizada = await ImageManipulator.manipulateAsync(
                imagen,
                [{ resize: { width: ANCHO_MAX_IMAGEN } }],
                { compress: CALIDAD_JPEG, format: ImageManipulator.SaveFormat.JPEG },
            );

            const respuesta = await fetch(imagenOptimizada.uri);
            const blob = await respuesta.blob();
            const rutaStorage = `camisetas/${usuario.uid}/${Date.now()}.jpg`;
            const storageRef = ref(storage, rutaStorage);

            await new Promise<void>((resolve, reject) => {
                const tarea = uploadBytesResumable(storageRef, blob);
                tarea.on(
                    'state_changed',
                    snap => setProgreso(snap.bytesTransferred / snap.totalBytes),
                    reject,
                    resolve,
                );
            });

            const downloadURL = await getDownloadURL(storageRef);

            await addDoc(collection(db, 'camisetas'), {
                nombres: {
                    es: nombreEs.trim(),
                    en: nombreEn.trim() || nombreEs.trim(),
                    eu: nombreEu.trim() || nombreEs.trim(),
                },
                descripciones: {
                    es: descEs.trim(),
                    en: descEn.trim() || descEs.trim(),
                    eu: descEu.trim() || descEs.trim(),
                },
                imagen: downloadURL,
                precio: parseFloat(precio),
                estado: 'usada',
                estadoVenta: 'disponible',
                destacado: false,
                creadoPor: usuario.uid,
                vendedorId: usuario.uid,
                vendedorNombre: usuario.displayName ?? usuario.email ?? 'Usuario anónimo',
                vendedorFoto: usuario.photoURL ?? null,
                creadoEn: serverTimestamp(),
            });

            (dispatch as any)(fetchCamisetas());

            Alert.alert('¡Publicado!', 'El producto se ha añadido al catalogo.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            Alert.alert('Error al subir', error.message);
        } finally {
            setSubiendo(false);
            setProgreso(0);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>

                <TouchableOpacity style={styles.imagenPicker} onPress={abrirSelector} activeOpacity={0.8}>
                    {imagen ? (
                        <Image source={{ uri: imagen }} style={styles.imagenPreview} resizeMode="cover" />
                    ) : (
                        <View style={styles.imagenPlaceholder}>
                            <MaterialCommunityIcons name="camera-plus-outline" size={52} color="#bbb" />
                            <Text style={styles.placeholderTexto}>Toca para añadir foto</Text>
                        </View>
                    )}
                    {imagen && (
                        <View style={styles.cambiarFotoOverlay}>
                            <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                            <Text style={styles.cambiarFotoTexto}>Cambiar foto</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Text style={styles.seccion}>Nombre del producto</Text>
                <TextInput label="Español *" mode="outlined" value={nombreEs} onChangeText={setNombreEs} style={styles.input} />
                <TextInput label="English" mode="outlined" value={nombreEn} onChangeText={setNombreEn} style={styles.input} />
                <TextInput label="Euskara" mode="outlined" value={nombreEu} onChangeText={setNombreEu} style={styles.input} />

                <Text style={styles.seccion}>Descripción</Text>
                <TextInput label="Español *" mode="outlined" multiline numberOfLines={3} value={descEs} onChangeText={setDescEs} style={styles.input} />
                <TextInput label="English" mode="outlined" multiline numberOfLines={3} value={descEn} onChangeText={setDescEn} style={styles.input} />
                <TextInput label="Euskara" mode="outlined" multiline numberOfLines={3} value={descEu} onChangeText={setDescEu} style={styles.input} />

                <Text style={styles.seccion}>Precio</Text>
                <TextInput
                    label="Precio (€) *"
                    mode="outlined"
                    keyboardType="decimal-pad"
                    value={precio}
                    onChangeText={setPrecio}
                    style={styles.input}
                    left={<TextInput.Affix text="€" />}
                />

                {subiendo && (
                    <View style={styles.progresoContainer}>
                        <ActivityIndicator animating color={colorTiendaOscuro} />
                        <Text style={styles.progresoTexto}>Subiendo... {Math.round(progreso * 100)}%</Text>
                    </View>
                )}

                <Button
                    mode="contained"
                    onPress={subirProducto}
                    disabled={subiendo}
                    style={styles.boton}
                    icon="upload"
                    contentStyle={{ paddingVertical: 6 }}
                >
                    {subiendo ? 'Publicando...' : 'Publicar producto'}
                </Button>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    content: { padding: 20, paddingBottom: 50 },
    imagenPicker: {
        width: '100%',
        height: 220,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#e8e8e8',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    imagenPreview: { width: '100%', height: '100%' },
    imagenPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
    placeholderTexto: { color: '#aaa', fontSize: 14 },
    cambiarFotoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 6,
    },
    cambiarFotoTexto: { color: '#fff', fontSize: 13 },
    seccion: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colorTiendaOscuro,
        marginBottom: 8,
        marginTop: 4,
    },
    input: { marginBottom: 10, backgroundColor: '#fff' },
    progresoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginVertical: 12,
    },
    progresoTexto: { fontSize: 15, color: colorTiendaOscuro },
    boton: {
        marginTop: 16,
        backgroundColor: colorTiendaOscuro,
        borderRadius: 10,
    },
});
