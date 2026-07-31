// Content for the /rent-in/{city}/ landing pages (Phase 2 of the AEO plan).
// Keyword groupings sourced from Assets/SEO-AEO/Keywords for AEO.md location
// keyword maps. Sector lists are trimmed to a representative sample per city
// rather than the full plug-in list in the source doc.
export const locations = [
  {
    slug: "gurgaon",
    city: "Gurgaon",
    hasOffice: true,
    intro:
      "RentBasket runs a local office in Gurgaon, so furniture and appliance rentals here come with free delivery, installation, and maintenance across the city's residential sectors.",
    popularRentals: ["Sofa", "Bed", "Wardrobe", "Dining Table", "Fridge", "Washing Machine"],
    areas: [
      "Sector 14", "Sector 29", "Sector 49", "Sector 57", "Golf Course Road",
      "Sohna Road", "DLF Phase 1-5", "MG Road", "Dwarka Expressway",
    ],
    faqs: [
      {
        q: "Does RentBasket have an office in Gurgaon?",
        a: "Yes. Gurgaon is one of RentBasket's two office locations (alongside Noida), so delivery, installation, and service response times here are fastest.",
      },
      {
        q: "Which Gurgaon sectors do you deliver to?",
        a: "We cover residential sectors across Gurgaon including Golf Course Road, Sohna Road, DLF Phases, and Dwarka Expressway. Share your pin code to confirm your exact sector.",
      },
      {
        q: "Can I rent furniture for a PG or bachelor setup in Gurgaon?",
        a: "Yes, our monthly plans work well for bachelors, PG rooms, and corporate accommodation across Gurgaon, with no long-term commitment required.",
      },
    ],
  },
  {
    slug: "noida",
    city: "Noida",
    hasOffice: true,
    intro:
      "RentBasket runs a local office in Noida, covering furniture and appliance rentals across Noida, Greater Noida, and Noida Extension with free delivery and installation.",
    popularRentals: ["Sofa", "Bed", "Study Table", "Wardrobe", "Fridge", "Washing Machine"],
    areas: [
      "Sector 18", "Sector 62", "Sector 76", "Sector 137", "Greater Noida",
      "Greater Noida West", "Noida Extension",
    ],
    faqs: [
      {
        q: "Does RentBasket have an office in Noida?",
        a: "Yes. Noida is one of RentBasket's two office locations (alongside Gurgaon), so delivery, installation, and service response times here are fastest.",
      },
      {
        q: "Do you deliver to Greater Noida and Noida Extension?",
        a: "Yes, our Noida office covers Greater Noida, Greater Noida West, and Noida Extension in addition to Noida sectors. Share your pin code to confirm availability.",
      },
      {
        q: "Can I rent a full home setup in Noida?",
        a: "Yes, RentBasket offers complete home packages (furniture + appliances) for new flats and rented apartments across Noida.",
      },
    ],
  },
  {
    slug: "delhi",
    city: "Delhi",
    hasOffice: false,
    intro:
      "RentBasket serves Delhi from its Gurgaon and Noida offices, offering furniture and appliance rentals with delivery across South, West, and Central Delhi (availability varies by area).",
    popularRentals: ["Sofa", "Bed", "Wardrobe", "Dining Table", "Fridge"],
    areas: [
      "South Delhi", "West Delhi", "Dwarka", "Rohini", "Janakpuri",
      "Lajpat Nagar", "Saket", "Vasant Kunj",
    ],
    faqs: [
      {
        q: "Does RentBasket deliver furniture on rent in Delhi?",
        a: "Yes, RentBasket serves parts of Delhi from its Gurgaon and Noida offices. Share your pin code to confirm whether your area is currently serviceable.",
      },
      {
        q: "Which parts of Delhi do you cover?",
        a: "Coverage is strongest in areas closer to Gurgaon and Noida, such as South Delhi and West Delhi. We're expanding coverage — check your pin code for confirmation.",
      },
      {
        q: "Is there a minimum rental period for Delhi orders?",
        a: "Yes, the standard minimum lock-in is 3 months, same as our Gurgaon and Noida plans.",
      },
    ],
  },
];
