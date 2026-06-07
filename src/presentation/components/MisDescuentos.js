import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSelector } from 'react-redux';
import { doc, collection, onSnapshot, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from '../../api/firebaseConfig';
import { useTranslation } from 'react-i18next';

export default function MisDescuentos() {
  const [cupones, setCupones] = useState([]); // es donde vamos a guardar la lista de cupones
  const [scanned, setScanned] = useState(false); // Cuando el usuario escanea el qr, cambia de false a true
  const [permission, requestPermission] = useCameraPermissions(); // Para controlar los permisos de la camara
  const userId = useSelector((state) => state.usuario?.user?.uid); // Extraemos el uid del usuario que esta ahora log
  const { t } = useTranslation();

  useEffect(() => {
    if (!userId) return; // Primero verificamos si ese user con ese userid existe
    const colRef = collection(db, 'carritos', userId, 'historial_cupones');
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })); // Despues de esta linea tendremos algo como: { id: "FUTBOL10", valor: 10, escaneado: true, canjeado: false }
      setCupones(data); // Actualizamos el estado
    });
    return () => unsubscribe(); // Para apagar la conexion con firebase
  }, [userId]);

  const handleBarcodeScanned = async ({ data }) => {
    if (scanned || !userId) return;
    setScanned(true); // Aqui desactivamos la camara

    let valorDescuento = 0;
    if (data.includes('FUTBOL10')) valorDescuento = 10; // A partir de aqui vamos a transformar a un valor numerico
    else if (data.includes('FUTBOL20')) valorDescuento = 20;
    else if (data.includes('FUTBOL40')) valorDescuento = 40;

    // Caso de codigo no reconocido
    if (valorDescuento === 0) {
      Alert.alert(t('MisDescuentos.error'), t('MisDescuentos.codigo_no_reconocido'));
      setScanned(false);
      return;
    }

    const cuponRef = doc(db, 'carritos', userId, 'historial_cupones', data); // Este es el puntero para el cupon que se acaba de escanear
    const carritoRef = doc(db, 'carritos', userId); // Este para saber cuantos descuentos tiene almacenado

    try {
      await runTransaction(db, async (transaction) => {
        const cuponDoc = await transaction.get(cuponRef); // Para ver si existe o no el cupon (dentro de historial_cupones)
        
        if (cuponDoc.exists()) {
          throw new Error(t('MisDescuentos.codigo_ya_escaneado'));
        }

        const carritoSnap = await transaction.get(carritoRef); // Vamos a buscar en carritos
        const dataActual = carritoSnap.exists() ? carritoSnap.data() : { descuentosAplicados: {} };

        // Calculamos los nuevos descuentos
        const nuevosDescuentos = { 
          ...(dataActual.descuentosAplicados || {}), 
          [data]: valorDescuento 
        };

        // Calculamos el nuevo descuento completo 
        const nuevoTotalDescuento = Object.values(nuevosDescuentos).reduce((a, b) => a + b, 0);

        transaction.set(cuponRef, {
          valor: valorDescuento,
          escaneado: true,
          canjeado: false,
          fecha: serverTimestamp()
        });

        transaction.set(carritoRef, {
          descuentosAplicados: nuevosDescuentos,
          totalDescuento: nuevoTotalDescuento
        }, { merge: true });
      });

      Alert.alert(t('MisDescuentos.exito'), t('MisDescuentos.aplicado', { valor: valorDescuento }));
    } catch (e) {
      Alert.alert(t('MisDescuentos.error'), e.message);
    }
    
    setTimeout(() => setScanned(false), 2000);
  };

  if (!permission?.granted) { // Esto es basicamente para el caso en el cual no se han dado permisos a la camara
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{t('MisDescuentos.permiso_camara')}</Text>
        <Button onPress={requestPermission} title={t('MisDescuentos.dar_permiso')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        <CameraView 
          style={StyleSheet.absoluteFillObject} 
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} 
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.title}>{t('MisDescuentos.titulo')}</Text>
        <FlatList
          data={cupones}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.card, item.canjeado && styles.cardUsed]}>
              <Text style={styles.codeText}>{item.id}</Text>
              <Text style={styles.valueText}>{item.valor}€</Text>
              <Text>{item.canjeado ? t('MisDescuentos.estado_canjeado') : t('MisDescuentos.estado_disponible')}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scannerContainer: { height: 300 },
  listContainer: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  card: { padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardUsed: { opacity: 0.5 },
  codeText: { fontWeight: 'bold', fontSize: 16 },
  valueText: { color: 'green', fontWeight: 'bold', fontSize: 16 }
});