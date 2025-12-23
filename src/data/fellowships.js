export const FELLOWSHIPS = [
    {
        id: '1',
        name: 'Ephesus',
        color: '#E53935', // Red
        icon: 'heart',
        image: 'https://images.unsplash.com/photo-1544427920-299317d446df?q=80&w=2400'
    },
    {
        id: '2',
        name: 'Smyrna',
        color: '#FB8C00', // Orange
        icon: 'flame',
        image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=2400'
    },
    {
        id: '3',
        name: 'Pergamos',
        color: '#D81B60', // Pink/Crimson
        icon: 'shield',
        image: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?q=80&w=2400'
    },
    {
        id: '4',
        name: 'Thyatira',
        color: '#8E24AA', // Purple
        icon: 'star',
        image: 'https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=2400'
    },
    {
        id: '5',
        name: 'Sardis',
        color: '#3949AB', // Indigo
        icon: 'sparkles',
        image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2400'
    },
    {
        id: '6',
        name: 'Philadelphia',
        color: '#E91E63', // Rose
        icon: 'key',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400'
    },
    {
        id: '7',
        name: 'Laodicea',
        color: '#FDD835', // Gold
        icon: 'eye',
        image: 'https://images.unsplash.com/photo-1493612276216-9c59019558f3?q=80&w=2400'
    },
    {
        id: '8',
        name: 'Philippi',
        color: '#1E88E5', // Blue
        icon: 'happy',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2400'
    },
    {
        id: '9',
        name: 'Berea',
        color: '#43A047', // Green
        icon: 'book',
        image: 'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?q=80&w=2400'
    },
    {
        id: '10',
        name: 'Balance',
        color: '#009688', // Teal
        icon: 'scale', // Ionicons has 'scale' or similar? 'git-balance'? Let's check icons. 'fitness' might imply physical balance. 'infinite' or 'leaf'. Let's use 'leaf' for growth/balance or 'pulse'. Actually 'partly-sunny' implies balance of elements? Let's use 'leaf'.
        // Wait, standard Ionicons has 'construct' or 'options' for balance/settings? 
        // Let's use 'contract' or something. 
        // Actually, 'bicycle' :) No. 
        // Let's use 'radio-button-on' or 'disc'. 
        // How about 'contrast'?
        // Let's stick to 'flower' (filter) or just 'ellipse'. 
        // Wait, 'scale-outline' exists? Probably not in standard set easily guessable.
        // Let's use 'infinite'.
        icon: 'infinite',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2400' // Yoga/Nature/Balance vibe
    }
];

export const getFellowshipTheme = (name) => {
    const found = FELLOWSHIPS.find(f => f.name === name);
    if (found) return found;
    return FELLOWSHIPS[0]; // Default to Ephesus if not found
};
