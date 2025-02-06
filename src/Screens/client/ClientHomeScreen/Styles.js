import { StyleSheet, Dimensions } from 'react-native';

const PRIMARY_COLOR = '#fec107';
const SECONDARY_COLOR = '#ffffff';
const NEUTRAL_COLOR = '#2c3e50';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingTop: 50,
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2d3436',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  section: {
    marginVertical: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  storyWrapper: {
    alignItems: 'center',
    marginHorizontal: 24,
  },
  storyBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  storyGlow: {
    position: 'absolute',
    width: 60,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  storyMeta: {
    position: 'absolute',
    bottom: -15,
    width: '100%',
    alignItems: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '',
    paddingHorizontal: 12,
    
    paddingVertical: 6,
    borderRadius: 20,
  },
  storyUser: {
    color: '#2d3436',
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  servicesContainer: {
    paddingLeft: 24,
  },
  serviceCard: {
    width: width * 0.8,
    height: 250,
    marginRight: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  serviceGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    padding: 15,
    justifyContent: 'flex-end',
  },
  serviceName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 5,
  },
  serviceBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 15,
  },
  serviceBadgeText: {
    color: '#2d3436',
    fontSize: 12,
    fontWeight: '600',
  },
  achievementsRow: {
    marginHorizontal: 12,
    justifyContent: 'space-between',
  },
  achievementItem: {
    width: (width - 40) / 3,
    height: (width - 40) / 3,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  achievementImage: {
    width: '100%',
    height: '100%',
  },
  achievementOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  achievementLikes: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.96)',
  },
  fullscreenImage: {
    flex: 1,
    marginVertical: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 75,
    right: 24,
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 100,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    zIndex: 100,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  storyFooter: {
    position: 'absolute',
    bottom: 50,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyUserModal: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '00',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 8,
  },
  modalVerifiedBadge: {
    marginLeft: 5,
  },
  modalLikeButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
export default styles;