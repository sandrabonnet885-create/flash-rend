function mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function hashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export type TimelineDataPoint = {
    time: Date;
    value: number;
    targetLine: number;
    timestamp: number;
}

/**
 * Generates a realistic crypto-like chart timeline.
 * Uses a pseudo-random Brownian Bridge to ensure the path is volatile
 * but strictly ends at the `finalAmount`.
 * The curve is deterministic based on the `id`, so reloads show the same exact path.
 */
export function generateInvestmentTimeline(
    id: string, 
    amount: number, 
    finalAmount: number, 
    createdAt: Date | string, 
    endsAt: Date | string, 
    points = 60
): TimelineDataPoint[] {
    const seed = hashCode(id);
    // Add a bit of salt so it's a unique sequence per investment
    const random = mulberry32(seed + 102938); 
    
    const startTime = new Date(createdAt).getTime();
    const endTime = new Date(endsAt).getTime();
    const duration = endTime - startTime;
    
    const walk = [0];
    for (let i = 1; i <= points; i++) {
        // -1 to 1 step
        const step = (random() * 2) - 1; 
        walk.push(walk[i-1] + step);
    }
    const WT = walk[points];
    
    const data: TimelineDataPoint[] = [];
    
    for(let i=0; i<=points; i++) {
        const t = i / points; // 0 to 1
        
        // Brownian bridge math: W_t - t * W_T
        // Guarantees bridge is 0 at both t=0 and t=1
        const bridge = walk[i] - t * WT;
        
        // Base growth curve (squared for a bit of exponential feel)
        const baseCurve = amount + (finalAmount - amount) * Math.pow(t, 1.5); 
        
        // Volatility depends on the magnitude of the final amount relative to the start
        // A standard deviation proxy to make the chart look active but not chaotic
        const envelope = Math.abs(finalAmount - amount) * 0.15; 
        
        // Add the bridge to the base curve, scaled
        const value = baseCurve + bridge * (envelope / Math.sqrt(points));
        
        data.push({
            time: new Date(startTime + duration * t),
            timestamp: startTime + duration * t,
            // Guard rails to make sure points 0 and N are exact, and it never drops below a certain amount
            value: i === 0 ? amount : (i === points ? finalAmount : Math.max(amount * 0.5, value)),
            targetLine: finalAmount
        });
    }
    
    return data;
}
