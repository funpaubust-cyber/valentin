import { MAP_LAT, MAP_LON } from "@/components/ui/YandexMapLabel";
import { yandexReviews } from "@/data/reviews";
import {
  SALON_ADDRESS,
  SALON_CITY,
  SALON_CLOSES,
  SALON_EMAIL,
  SALON_NAME,
  SALON_OPENS,
  SALON_PHONE_HREF,
  SALON_PLACE,
  SALON_STREET,
  VK_URL,
  YANDEX_ORG_URL,
  YANDEX_RATING,
  YANDEX_RATING_COUNT,
  YANDEX_REVIEW_COUNT,
} from "@/data/salon";
import { siteUrl } from "@/lib/site";
import { siteImages } from "@/data/products";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function JsonLd() {
  const url = siteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: SALON_NAME,
    image: `${url}${siteImages.hero}`,
    url,
    telephone: SALON_PHONE_HREF.replace("tel:", ""),
    email: SALON_EMAIL,
    sameAs: [VK_URL, YANDEX_ORG_URL],
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SALON_STREET}, ${SALON_PLACE}`,
      addressLocality: SALON_CITY,
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: MAP_LAT,
      longitude: MAP_LON,
    },
    openingHoursSpecification: DAYS.map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: day,
      opens: SALON_OPENS,
      closes: SALON_CLOSES,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: YANDEX_RATING,
      reviewCount: YANDEX_REVIEW_COUNT,
      ratingCount: YANDEX_RATING_COUNT,
      bestRating: 5,
      worstRating: 1,
    },
    review: yandexReviews.slice(0, 6).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      datePublished: review.date,
      reviewBody: review.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
