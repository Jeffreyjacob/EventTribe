import EntertainmentImage from "@/assets/entertainment.png"
import EducationImage from "@/assets/education.png"
import CulturalImage from "@/assets/culture.png"
import SportImage from "@/assets/sport.png"
import TechnologyImage from "@/assets/technology.png"
import TravelImage from "@/assets/travel.png"

export type UserType = {
    user: {
        id: number,
        email: string,
        full_name: string,
        role: string
    },
    gender: string,
    image: string,
    interest: string[],
    dob: string,
    address: string,
    phone_number: string
}

export const NavLink = [
    { name: "Home", href: '/' },
    { name: "Events", href: '/eventListing' },
    { name: "About", href: '/about' },
    { name: "Contact", href: '/contact' }
]

export const FooterLink = [
    {
        title: "Company Info",
        sublink: [
            { name: "About Us", href: "about" },
            { name: "Contact Us", href: "contact" },
            { name: "Careers", href: "careers" },
            { name: "FAQs", href: "faqs" },
            { name: "Terms of Service", href: "terms" },
            { name: "Privacy Policy", href: "privacy" },
        ],
    },
    {
        title: "Help",
        sublink: [
            { name: "Account Support", href: "account_support" },
            { name: "Listing Events", href: "listingEvent" },
            { name: "Event Ticketing", href: "eventTicketing" },
            { name: "Ticket Purchase Terms & Conditions", href: "terms & conditions" }
        ],
    },
    {
        title: "Categories",
        sublink: [
            { name: "Concerts & Gigs", href: "concert" },
            { name: "Festivals & Lifestyle", href: "Festival" },
            { name: "Business & Networking", href: "businessNetworking" },
            { name: "Foods & Drinks", href: "foodDrinks" },
            { name: "Peforming Arts", href: "performingArts" },
            { name: "Sports & Outdoors", href: "sportOutdoors" },
            { name: "Exhibitions", href: "exhibitions" },
            { name: "Workshops, Conference & Classes", href: "workshopConference" }
        ],
    },
    {
        title: "Follow Us",
        sublink: [
            { name: "Facebook", href: "facebook" },
            { name: "Instagram", href: "instagram" },
            { name: "Twitter", href: "twitter" },
            { name: "Youtube", href: 'youtube' }
        ]
    }
]

export const Interest = [
    {
      title:"Music",
      categories:[
        {name:"Concerts",value:"Concerts"},
        {name:"Music Festivals",value:"Music Festivals"},
        {name:"Music Workshops",value:"Music Workshops"},
        {name:"Dj Nights",value:"Dj Nights"}
      ]
    },
    {
        title:"Arts & Culture",
        categories:[
          {name:"Art Exhibitions",value:"Art Exhibitions"},
          {name:"Cultural Festivals",value:"Cultural Festivals"},
          {name:"Theater Plays",value:"Theater Plays"},
          {name:"Dance Performances",value:"Dance Performances"},
        ]
      },
      {
        title:"Food & Drink",
        categories:[
          {name:"Food Festivals",value:"Food Festivals"},
          {name:"Wine Tastings",value:"Wine Tastings"},
          {name:"Cooking Classes",value:"Cooking Classes"},
          {name:"Beer Festivals",value:"Beer Festivals"},
        ]
      },
      {
        title:"Sport & Fitness",
        categories:[
          {name:"Marathons",value:"Marathons"},
          {name:"Yoga Sessions",value:"Yoga Sessions"},
          {name:"Fitness Workshops",value:"Fitness Workshops"},
          {name:"Sporting Events",value:"Sporting Events"},
        ]
      },
      {
        title:"Business & Networking",
        categories:[
          {name:"Conferences",value:"Conferences"},
          {name:"Seminars",value:"Seminars"},
          {name:"Workshops",value:"Workshops"},
          {name:"Networking Events",value:"Network Events"},
        ]
      },
      {
        title:"Family & kids",
        categories:[
          {name:"Family-Friendly Events",value:"Family-Friendly Events"},
          {name:"Children's Workshops",value:"Children's Workshops"},
          {name:"Kid-Friendly Shows",value:"Kid-Friendly Shows"},
          {name:"Educational Activites",value:"Educational Activities"},
        ]
      },
      {
        title:"Technology",
        categories:[
          {name:"Tech Conferences",value:"Tech Conferences"},
          {name:"Hackathons",value:"Hackathons"},
          {name:"Startup Events",value:"Startup Events"},
          {name:"Gadget Expos",value:"Gadget Expos"},
        ]
      },
      {
        title:"Comedy & Entertainment",
        categories:[
          {name:"Start-up Comedy",value:"Start-up Comedy"},
          {name:"Improve Nights",value:"Improve Nights"},
          {name:"Comedy Festivals",value:"Comedy Festivals"},
          {name:"Magic Shows",value:"Magic Shows"},
        ]
      },
      {
        title:"Charity & Causes",
        categories:[
          {name:"Fundraising Events",value:"Fundraising Events"},
          {name:"Charity Galas",value:"Charity Galas"},
          {name:"Benefit Concerts",value:"Benefit Concerts"},
          {name:"Auctions & Fundraisers",value:"Auctions & Fundraisers"},
        ]
      },
      {
        title:"Education & Learning",
        categories:[
          {name:"Lectures & Talks",value:"Lectures & Talks"},
          {name:"Workshops",value:"Workshops"},
          {name:"Educational Seminars",value:"Educational Seminars"},
          {name:"Skill-Building Sessions",value:"Skill-Building Sessions"},
        ]
      },
      {
        title:"Travel & Adventures",
        categories:[
          {name:"City Tours",value:"City Tours"},
          {name:"Adventure Travel",value:"Adventure Travel"},
          {name:"Cultural Experiences",value:"Cultural Experiences"},
          {name:"Cruise Vacations",value:"Cruise Vacations"},
        ]
      },
]

export const UpdateUserDefault = {
    gender:"",
    phone_number:"",
    address:"",
    updated_image:null,
    interest:[],
    dob:""
}

export const ExploreCategoriesData = [
    {name:"Entertainment",image:EntertainmentImage,value:"Entertainment"},
    {name:"Educational & Business",image:EducationImage,value:"Education"},
    {name:"Cultural & Arts",image:CulturalImage,value:"arts"},
    {name:"Sport & Fitness",image:SportImage,value:"sport"},
    {name:"Technology & Innovation",image:TechnologyImage,value:"technology"},
    {name:"Travel & Adventure",image:TravelImage,value:"travel"},
]

export type EventType = {
        id:string
        title:string
        organizer:number
        description:string
        start_date:string
        end_date:string,
        location:string,
        category:string,
        eventType:string,
        price:string,
        capacity:number,
        image:string
        favorited:number[],
        attendees:number[]
}

export type OrganizerType = {
    user:{
      id:number,
      email:string,
      full_name:string,
      role:string
      },
    followers:number[]
}

export type OrganizerDetailType = {
    organizer: {
      user:{
        id:number,
        email:string,
        full_name:string,
        role:string
        },
      followers:number[]
    }
    events:EventType[]
}