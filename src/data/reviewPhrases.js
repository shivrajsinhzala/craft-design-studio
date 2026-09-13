/**
 * Combinatorial Review Engine for Craft Design Studio (Morbi & Rajkot)
 * 4 independent phrase arrays producing 22 x 21 x 21 x 21 = 203,889+ unique variations.
 * Exceeds the 50,000+ anti-duplicate requirement.
 */

export const BUSINESS_CONFIG = {
  name: "Craft Design Studio",
  shortName: "Craft Design Studio",
  tagline: "Interior Design & 3D Architectural Visualization",
  city: "Morbi & Rajkot",
  state: "Gujarat",
  googleReviewUrl: "https://g.page/r/CadGQKc8Z3nsEAE/review",
  rating: "5.0",
  verifiedBadge: "Morbi • Rajkot, Gujarat",
  phone: "+91 87583 95671"
};

export const OPENINGS = [
  "Outstanding experience with Craft Design Studio in Morbi!",
  "Best interior design studio in Morbi and Rajkot by far.",
  "Had an amazing experience working with Craft Design Studio.",
  "Truly the best interior designers we have worked with in Gujarat.",
  "Very happy with the design work done by Craft Design Studio!",
  "Superb service and creative concepts by Craft Design Studio.",
  "Morbi ma interior design ane 3D visualization mate best studio che.",
  "Exceptional architectural visualization and interior work!",
  "Craft Design Studio completely transformed our space into a masterpiece.",
  "Hands down the most professional interior team in Morbi.",
  "Incredible attention to detail and modern aesthetics from Craft Design Studio.",
  "From our initial consultation to final delivery, the experience was seamless.",
  "Top-notch interior design and 3D rendering services in Morbi.",
  "Vishvarajsinh, Yash, and the entire Craft Design Studio team did a phenomenal job.",
  "Extremely impressed with the quality and creativity of Craft Design Studio.",
  "Best decision we made was hiring Craft Design Studio for our home project.",
  "Bahu j saras ane luxury interior design work Morbi ma.",
  "A wonderful and stress-free interior design journey with Craft Design Studio.",
  "Brilliant concepts, photorealistic 3D models, and timely execution.",
  "Highest recommendation for Craft Design Studio Morbi!",
  "Remarkable talent and dedication shown by the team at Craft Design Studio.",
  "Ekdum premium and timely service by Craft Design Studio team."
];

export const ACTIONS = [
  "Their 3D elevation renders and realistic walkthroughs gave us total clarity before starting work.",
  "They understood our aesthetic taste immediately and turned our dream home into reality.",
  "The spatial planning, custom lighting layout, and color palette were planned to perfection.",
  "Their turnkey execution saved us so much time and hassle during construction.",
  "Every detail from material selection to carpentry and finish was executed flawlessly.",
  "The 3D photorealistic visualizations were identical to the final finished interior.",
  "They planned our modular kitchen, living space, and bedrooms with utmost elegance.",
  "Their showroom display designs and tile presentation concepts are truly world-class.",
  "The team was always available on-site to supervise every minor installation.",
  "They delivered photorealistic 3D renders with lighting and texture details well ahead of schedule.",
  "They maximized our floor space and incorporated smart storage without compromising on luxury.",
  "Their guidance on tile textures, Italian marble, and veneer finishes made a huge difference.",
  "Emana 3D renders ane layout planning thi amaro time ane budget banne bachi gaya.",
  "Their modern contemporary design balanced elegance, functionality, and budget effortlessly.",
  "Turnkey management was so smooth, keeping us updated on every stage of the project.",
  "They transformed our commercial office into a sleek, productive, and inviting environment.",
  "The ceiling designs, custom cabinetry, and ambient lighting turned out breathtaking.",
  "Ghar nu interior planning ane lighting selection khub j mast karyu che.",
  "Their technical drawings, 3D views, and material estimates were spot on.",
  "They handled everything from space architecture to furniture selection with great finesse.",
  "The precision in their 3D architectural rendering and elevation design is unmatched in Morbi."
];

export const IMPRESSIONS = [
  "Vishvarajsinh and Yash are extremely humble, creative, and patient with all revisions.",
  "Transparent pricing with no hidden costs and absolute honesty in material recommendations.",
  "The staff is polite, cooperative, and committed to uncompromised craftsmanship.",
  "Clean site management, respectful team, and meticulous dedication to quality standards.",
  "They listen carefully to your vision and never force unrealistic ideas on you.",
  "Kam ma finishing ane accuracy khub j uttam che, complete professional approach.",
  "Their patience during design iterations and prompt communication made everything easy.",
  "Always punctual with site meetings and milestone deliveries.",
  "Very professional demeanor, reasonable fees, and genuine advice on premium materials.",
  "Team behavior is very polite, responsive, and always ready to accommodate our feedback.",
  "Puri team khub j cooperative che ane timing nu dhyan rakhe che.",
  "They treated our home project with the same care and passion as if it were their own.",
  "Honest advice, fair budgeting, and superior finish that exceeded our expectations.",
  "Their architectural flair and modern perspective bring fresh life to Morbi interiors.",
  "Zero stress throughout the project thanks to their structured communication.",
  "A perfect blend of youthful innovation and solid technical execution.",
  "Super clean execution and polite craftsmen who respected our timeline.",
  "Trustworthy, transparent, and always available to answer our queries.",
  "Bahu j vinamra ane helpful team che, direct owners guide kare che.",
  "Unmatched professionalism, creative problem-solving, and pleasant work atmosphere.",
  "Reliable guidance on budget allocation without sacrificing design quality."
];

export const CLOSINGS = [
  "Full 5 stars! Will definitely work with them on all future projects.",
  "Highly recommended to anyone looking for premium interiors in Morbi and Rajkot!",
  "Deserves more than 5 stars! Thank you Craft Design Studio!",
  "Definitely 5 stars! Morbi ma best interior studio.",
  "100% recommended for turnkey interior design and 3D architectural work.",
  "Five stars all the way! Best decision we made for our home.",
  "Will definitely hire them again without any second thought!",
  "Ghar ane showroom interior mate badha ne recommend karu chu.",
  "Top-tier design studio! Thank you Vishvarajsinh, Yash, and team.",
  "A solid 5-star experience. Don't look anywhere else in Morbi!",
  "Kudos to Craft Design Studio! Highly recommended to friends and family.",
  "Truly a 5-star team with 5-star service. Keep up the brilliant work!",
  "Morbi's best interior team. 5 stars guaranteed!",
  "Super satisfied and will happily recommend Craft Design Studio to everyone.",
  "Five glowing stars! Outstanding service and beautiful results.",
  "Khub j saras anubhav rahyo. 5 stars!",
  "Cannot recommend Craft Design Studio enough. Truly exceptional!",
  "Big 5 stars for the team's hard work, aesthetics, and perfection.",
  "Best interior and 3D studio in Saurashtra! 5 stars.",
  "Great experience from start to finish! 5 stars.",
  "Strongly recommended for luxury home interiors in Morbi!"
];

/**
 * Returns a pseudo-random integer between 0 and max - 1
 */
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Generates a cohesive 4-part 5-star review from the combinatorial matrix
 */
export function generateRandomReview() {
  const opening = OPENINGS[getRandomIndex(OPENINGS.length)];
  const action = ACTIONS[getRandomIndex(ACTIONS.length)];
  const impression = IMPRESSIONS[getRandomIndex(IMPRESSIONS.length)];
  const closing = CLOSINGS[getRandomIndex(CLOSINGS.length)];

  return `${opening} ${action} ${impression} ${closing}`;
}
