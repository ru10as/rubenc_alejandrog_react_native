import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTranslation } from 'react-i18next';
import { canjearCupon,suscribirseACupones } from '../../redux/ActionCreators';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  userId: state.usuario?.user?.uid
});

const mapDispatchToProps = dispatch => ({
  canjearCupon: (uid, data) => dispatch(canjearCupon(uid, data))
});

function MisDescuentos({userId, canjearCupon, navigation}) {
  const [cupones, setCupones] = useState([]); // es donde vamos a guardar la lista de cupones
  const [scanned, setScanned] = useState(false); // Cuando el usuario escanea el qr, cambia de false a true
  const [permission, requestPermission] = useCameraPermissions(); // Para controlar los permisos de la camara
  const { t } = useTranslation();

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = suscribirseACupones(userId, (data) => {
      setCupones(data);
    });
    return () => unsubscribe();
  }, [userId]);

  const handleBarcodeScanned = async ({ data }) => {
    if (scanned || !userId) return;
    setScanned(true);

    try {
      const resultado = await canjearCupon(userId, data);
      Alert.alert(t('MisDescuentos.exito'), t('MisDescuentos.aplicado', { valor: resultado.valor }));
    } 
    catch (e) {
      Alert.alert(t('MisDescuentos.error'), e.message);
    } finally {
      setTimeout(() => setScanned(false), 2000);
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(MisDescuentos);