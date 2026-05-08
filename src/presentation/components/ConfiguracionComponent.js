import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Divider, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const SeccionConfiguracion = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const cambiarIdioma = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <List.Section>
        {/* Título de la sección */}
        <List.Subheader>{t('configuracion_ajustes') || 'Ajustes'}</List.Subheader>
        
        {/* Acordeón de Idiomas */}
        <List.Accordion
          title={t('configuracion_idioma') || 'Idioma'}
          left={props => <List.Icon {...props} icon="translate" />}
        >
          <List.Item 
            title="Español" 
            onPress={() => cambiarIdioma('es')}
            right={props => i18n.language === 'es' && <List.Icon {...props} icon="check" color="green" />}
          />
          <List.Item 
            title="English" 
            onPress={() => cambiarIdioma('en')}
            right={props => i18n.language === 'en' && <List.Icon {...props} icon="check" color="green" />}
          />
          <List.Item 
            title="Euskara" 
            onPress={() => cambiarIdioma('eu')}
            right={props => i18n.language === 'eu' && <List.Icon {...props} icon="check" color="green" />}
          />
        </List.Accordion>
      </List.Section>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});

export default SeccionConfiguracion;