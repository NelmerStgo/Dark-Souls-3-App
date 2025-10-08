import React, { useCallback, useMemo } from 'react';
import * as Linking from 'expo-linking';
import {
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    View,
    Alert,
    Pressable,
    Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colores } from '../theme/colores';

const GOLD = '#C9A46C';
const GOLD_SOFT = '#E3C890';
const ASH_BG = '#0D0D0D';
const PANEL_BG = '#151312';
const BORDER = '#2A2117';
const TEXT_BODY = '#D3CEC2';
const SUBTLE = '#8E8578';
const EMBER = '#D1592C';

const linksData = [
    {
        icon: 'logo-linkedin',
        label: 'Ing. Nelmer Santiago Padrón',
        url: '', // LinkedIn
        kind: 'profile'
    },
    {
        icon: 'logo-github',
        label: 'Repositorio',
        url: 'https://github.com/NelmerStgo/Dark-Souls-3-App.git',
        kind: 'code'
    }
];

const sourcesData = [
    {
        label: 'Dark Souls Wiki',
        url: 'https://darksouls.fandom.com/es/wiki/Wiki_Dark_Souls'
    },
    {
        label: 'Elite Guías',
        url: 'https://www.eliteguias.com/guias/d/dksl3/dark-souls-iii.php'
    }
];

const OrnamentalDivider = ({ style }) => (
    <View style={[styles.dividerContainer, style]}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerGlyph}>✠</Text>
        <View style={styles.dividerLine} />
    </View>
);

const SectionCard = ({ title, children, noPad, ornament = true }) => (
    <View style={styles.sectionCard}>
        {title ? (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                {ornament && <View style={styles.sectionUnderline} />}
            </View>
        ) : null}
        <View style={[!noPad && styles.sectionInner]}>{children}</View>
    </View>
);

const LinkCard = ({ icon, label, url }) => {
    const handlePress = useCallback(() => {
        if (!url) {
            Alert.alert('Enlace no disponible', 'Este enlace aún no ha sido configurado.');
            return;
        }
        Linking.openURL(url).catch(() =>
            Alert.alert('Error', 'No se pudo abrir el enlace.')
        );
    }, [url]);

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.linkRow,
                pressed && styles.linkRowPressed
            ]}
            accessibilityRole="link"
            accessibilityLabel={label}
        >
            <View style={styles.linkIconWrapper}>
                <Ionicons name={icon} size={18} color={GOLD_SOFT} />
            </View>
            <Text style={styles.linkLabel}>{label}</Text>
            <Ionicons name="chevron-forward" size={16} color={SUBTLE} />
        </Pressable>
    );
};

const ExternalSourceLink = ({ label, url }) => {
    const handlePress = () =>
        Linking.openURL(url).catch(() =>
            Alert.alert('Error', 'No se pudo abrir el enlace.')
        );

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={styles.sourceLine}
            activeOpacity={0.7}
            accessibilityRole="link"
            accessibilityLabel={`Fuente: ${label}`}
        >
            <View style={styles.bullet} />
            <Text style={styles.sourceLabel}>{label}</Text>
            <Ionicons name="open-outline" size={16} color={GOLD} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
    );
};

const AboutScreen = () => {
    const currentYear = new Date().getFullYear();

    const introParagraphs = useMemo(
        () => [
            'Bienvenid@, Latente.',
            'En un mundo donde la oscuridad y la desolación reinan, tú, un caballero errante en busca de la verdad, has tomado la antorcha para iluminar los rincones más sombríos del Reino de Lothric. \nEsta aplicación es tu fiel guía, diseñada para asistirte en tu arduo camino hacia la grandeza y la gloria.',
            'Aquí encontrarás los secretos mejor guardados: objetos ocultos, anillos ancestrales, gestos y hechizos olvidados. Nada quedará sin descubrir si mantienes encendida la llama.',
            'Adéntrate en este viaje, y que las brasas de tu determinación jamás se extingan.'
        ],
        []
    );

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Título principal */}
                <Text style={styles.appTitle}>Ashen Codex</Text>
                <OrnamentalDivider style={{ marginBottom: 16 }} />

                {/* Introducción */}
                <SectionCard>
                    {introParagraphs.map((p, idx) => (
                        <Text key={idx} style={styles.paragraph}>
                            {p}
                        </Text>
                    ))}
                </SectionCard>

                {/* Desarrollador */}
                <SectionCard title="Desarrollador">
                    {linksData.map(item => (
                        <LinkCard key={item.label} icon={item.icon} label={item.label} url={item.url} />
                    ))}
                </SectionCard>

                {/* Fuentes */}
                <SectionCard title="Fuentes de información">
                    {sourcesData.map(s => (
                        <ExternalSourceLink key={s.url} label={s.label} url={s.url} />
                    ))}
                </SectionCard>

                <SectionCard title="Aviso Legal">
                    <Text style={styles.paragraph}>
                        Esta es una aplicación no oficial creada por un fan y para fans de la comunidad. No está afiliada, asociada, autorizada, respaldada por, ni de ninguna manera oficialmente conectada con FromSoftware, Inc., Bandai Namco Entertainment Inc., o cualquiera de sus subsidiarias o afiliadas.
                    </Text>
                    <Text style={styles.paragraph}>
                        "Dark Souls" y todos los nombres, imágenes y marcas relacionadas son propiedad de FromSoftware, Inc. y Bandai Namco Entertainment Inc.
                    </Text>
                </SectionCard>

                {/* Versión */}
                <SectionCard title="Versión de la aplicación">
                    <View style={styles.versionWrapper}>
                        <Ionicons name="flame" size={16} color={EMBER} style={{ marginRight: 8 }} />
                        <Text style={styles.versionText}>Versión 2.0.0</Text>
                    </View>
                    <Text style={styles.versionNote}>
                        Mantente atent@ a futuras actualizaciones con más categorías y optimizaciones.
                    </Text>
                </SectionCard>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© {currentYear} Ashen Codex App</Text>
                    <Text style={styles.footerSub}>Un compendio para los que aún vigilan la llama.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

/* ================== STYLES ================== */
const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colores.fondoBase
    },
    container: {
        flex: 1,
        paddingHorizontal: 20
    },
    scrollContent: {
        paddingTop: 22,
        paddingBottom: 40
    },

    appTitle: {
        fontFamily: 'OptimusPrinceps',
        fontSize: 30,
        textAlign: 'center',
        color: GOLD,
        letterSpacing: 1,
        marginBottom: 6
    },

    /* Divider */
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#2B2319',
        marginHorizontal: 10
    },
    dividerGlyph: {
        color: '#7A6343',
        fontSize: 14,
        fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' })
    },

    /* Section card */
    sectionCard: {
        backgroundColor: PANEL_BG,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: BORDER,
        marginBottom: 20,
        overflow: 'hidden'
    },
    sectionHeader: {
        paddingTop: 14,
        paddingHorizontal: 16
    },
    sectionTitle: {
        fontFamily: 'DarkSouls_Font',
        fontSize: 20,
        color: GOLD,
        letterSpacing: 0.5,
        marginBottom: 4
    },
    sectionUnderline: {
        height: 1,
        width: '100%',

        backgroundColor: '#3A2F20',
        borderRadius: 2,
        marginBottom: 4
    },
    sectionInner: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 4
    },

    paragraph: {
        fontSize: 14,
        lineHeight: 21,
        color: TEXT_BODY,
        marginBottom: 14,
        fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' })
    },

    /* Link rows */
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1915',
        borderWidth: 1,
        borderColor: '#2E2519',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 12
    },
    linkRowPressed: {
        backgroundColor: '#252019'
    },
    linkIconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: '#221D16',
        borderWidth: 1,
        borderColor: '#342819',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },
    linkLabel: {
        flex: 1,
        color: GOLD_SOFT,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.3
    },

    /* Sources */
    sourceLine: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        marginBottom: 4,
        paddingRight: 4
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: GOLD,
        marginRight: 10,
        marginLeft: 2
    },
    sourceLabel: {
        color: '#D5C9B5',
        fontSize: 14,
        textDecorationLine: 'underline',
        letterSpacing: 0.2
    },

    /* Version */
    versionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1A15',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#342819',
        marginBottom: 10
    },
    versionText: {
        color: GOLD_SOFT,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.4
    },
    versionNote: {
        color: SUBTLE,
        fontSize: 12,
        lineHeight: 18,
        letterSpacing: 0.3
    },

    /* Footer */
    footer: {
        alignItems: 'center',
        marginTop: 6
    },
    footerText: {
        color: GOLD,
        fontSize: 12,
        letterSpacing: 0.8,
        marginBottom: 4
    },
    footerSub: {
        color: SUBTLE,
        fontSize: 11,
        letterSpacing: 0.5
    }
});

export default AboutScreen;