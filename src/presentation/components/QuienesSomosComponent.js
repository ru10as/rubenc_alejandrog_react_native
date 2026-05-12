import React from 'react';
import { View, ScrollView, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Avatar, Card, Text, Divider, Surface, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { baseUrl, colorTiendaOscuro } from '../../comun/comun';

const { width } = Dimensions.get('window');

const mapStateToProps = (state) => ({
    actividades: state.actividades || { actividades: [] },
});

// Componente de "Stats" para fardar de números
const StatItem = ({ icon, count, label }) => (
    <View style={styles.statBox}>
        <IconButton icon={icon} iconColor={colorTiendaOscuro} size={30} />
        <Text style={styles.statCount}>{count}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

function QuienesSomos({ actividades }) {
    const { t } = useTranslation();

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            
            {/* 1. HERO SECTION: FONDO GUAPO Y TITULAZO */}
            <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000' }} 
                style={styles.hero}
            >
                <View style={styles.overlay}>
                    <Text style={styles.heroTitle}>THE 12th MAN</Text>
                    <View style={styles.badgeUnderline} />
                    <Text style={styles.heroSubtitle}>{t('qs_historia_subtitulo')}</Text>
                </View>
            </ImageBackground>

            {/* 2. NUESTRA FILOSOFÍA (QUÉ VENDEMOS) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('qs_que_vendemos_titulo', '¿Qué nos hace únicos?')}</Text>
                <View style={styles.featuresGrid}>
                    <Surface style={styles.featureCard} elevation={2}>
                        <IconButton icon="shield-check" iconColor={colorTiendaOscuro} />
                        <Text style={styles.featureText}>Calidad Élite</Text>
                    </Surface>
                    <Surface style={styles.featureCard} elevation={2}>
                        <IconButton icon="history" iconColor={colorTiendaOscuro} />
                    </Surface>
                    <Surface style={styles.featureCard} elevation={2}>
                        <IconButton icon="truck-fast" iconColor={colorTiendaOscuro} />
                        <Text style={styles.featureText}>Envío Express</Text>
                    </Surface>
                </View>
            </View>

            {/* 3. HISTORIA CON ESTILO */}
            <Surface style={styles.historySurface} elevation={1}>
                <Text style={styles.historyText}>
                    {t('qs_historia_parrafo_1')}
                </Text>
                <View style={styles.statsRow}>
                    <StatItem icon="tshirt-crew" count="+500" label="Modelos" />
                    <StatItem icon="account-group" count="+10k" label="Fans" />
                    <StatItem icon="map-marker-radius" count="3" label="Tiendas" />
                </View>
            </Surface>

            {/* 4. DÓNDE ESTAMOS (TIENDAS) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('qs_tiendas_titulo', 'Nuestras Sedes')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tiendasScroll}>
                    {['Madrid - Bernabéu', 'Barcelona - Camp Nou', 'Bilbao - San Mamés'].map((tienda, i) => (
                        <Surface key={i} style={styles.tiendaCard} elevation={3}>
                            <Avatar.Icon size={40} icon="storefront" backgroundColor={colorTiendaOscuro} />
                            <Text style={styles.tiendaNombre}>{tienda}</Text>
                            <Text style={styles.tiendaHorario}>10:00 - 21:00</Text>
                        </Surface>
                    ))}
                </ScrollView>
            </View>

            {/* 5. EL EQUIPO (TU LISTA DE ACTIVIDADES/PERSONAS) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('qs_actividades_titulo')}</Text>
                {actividades.actividades.map((item) => (
                    <Surface key={item.id} style={styles.equipoItem} elevation={1}>
                        <Avatar.Image source={{ uri: baseUrl + item.imagen }} size={60} />
                        <View style={styles.equipoInfo}>
                            <Text style={styles.equipoNombre}>{item.nombre}</Text>
                            <Text style={styles.equipoPuesto}>{item.descripcion}</Text>
                        </View>
                    </Surface>
                ))}
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2026 THE 12th MAN - THE FOOTBALL CULTURE</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    hero: { height: 250, width: '100%' },
    overlay: { 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    heroTitle: { fontSize: 38, fontWeight: '900', color: '#fff', letterSpacing: 2 },
    heroSubtitle: { color: '#fff', fontSize: 16, marginTop: 5, opacity: 0.9 },
    badgeUnderline: { width: 60, height: 4, backgroundColor: colorTiendaOscuro, marginTop: 10 },
    
    section: { padding: 20 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 15 },
    
    featuresGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    featureCard: { 
        width: (width - 60) / 3, 
        padding: 10, 
        alignItems: 'center', 
        borderRadius: 12, 
        backgroundColor: '#fff' 
    },
    featureText: { fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#333' },

    historySurface: { margin: 20, padding: 20, borderRadius: 15, backgroundColor: '#fff' },
    historyText: { textAlign: 'justify', lineHeight: 22, color: '#444' },
    
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
    statBox: { alignItems: 'center' },
    statCount: { fontSize: 20, fontWeight: '900', color: colorTiendaOscuro },
    statLabel: { fontSize: 12, color: '#888' },

    tiendasScroll: { paddingLeft: 5 },
    tiendaCard: { 
        width: 180, 
        padding: 20, 
        marginRight: 15, 
        borderRadius: 15, 
        backgroundColor: '#fff', 
        alignItems: 'center',
        marginBottom: 10
    },
    tiendaNombre: { fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
    tiendaHorario: { fontSize: 12, color: '#666' },

    equipoItem: { 
        flexDirection: 'row', 
        padding: 15, 
        marginBottom: 10, 
        borderRadius: 12, 
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    equipoInfo: { marginLeft: 15, flex: 1 },
    equipoNombre: { fontWeight: 'bold', fontSize: 16 },
    equipoPuesto: { color: '#666', fontSize: 13 },

    footer: { padding: 40, alignItems: 'center' },
    footerText: { color: '#bbb', fontSize: 10, letterSpacing: 1 }
});

export default connect(mapStateToProps)(QuienesSomos);