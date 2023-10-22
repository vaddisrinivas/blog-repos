import React from 'react';
import { lazy } from 'react';

const PythonInNotion = lazy(() => import('./pages/python-in-notion/PythonInNotion'));
const URLShortener = lazy(() => import('./pages/url-shortener/URLShortener'));
const ContactCard = lazy(() => import('./pages/contact-card/ContactCard'));
const Home = lazy(() => import('./pages/home/Home'));
const ShortenedURL = lazy(() => import('./pages/url-shortener/ShortenedURL'));

export const cards = [{
    name: "TheTechCruise",
    title: "Founder",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    website: "",
    description: "TheTechCruise",
    act: ()=>{window.location.href = "https://thetechcruise.com"},
    image: "https://public-apps-thetechcruise.s3.us-east-2.amazonaws.com/public/document.jpeg"
},{
    title: "Python in Notion",
    description: "Run Python code in Notion",
    image: "https://i.imgur.com/5q6Qv9V.png",
    link: "/python-in-notion",
    act: ()=>{window.location.href = "/python-in-notion"}
}, {
    title: "Home",
    description: "Home",
    image: "https://i.imgur.com/5q6Qv9V.png",
    link: "/"
},{
    title: "URL Shortener",
    description: "Shorten your URL",
    image: "https://i.imgur.com/5q6Qv9V.png",
    link: "/u",
    act: ()=>{window.location.href = "/u"}
}]

export  const routes = [
  {
    path: '/python-in-notion',
    title: 'Python in Notion',
    element: <PythonInNotion />,
    exact: true,
    showInDrawer: true,
  },
  {
    path: '/u',
    exact: true,
    title: 'URL Shortener',
    containsParams: true,
    element: <URLShortener props={{ api_url: "https://api.thetechcruise.com/u", title: "URL Shortener", description: "Shorten your URL" }} />,
    showInDrawer: true,
},
  {
    path: '/',
    title: 'Home',
    element: <Home props={cards} />,
    exact: true,
    showInDrawer: true,
  },
  {
    path: '/contactCard',
    title: 'Contact Card',
    card: {
      title: "Contact Card",
      description: "Contact Card",
      image: "https://i.imgur.com/5q6Qv9V.png",
      link: "/contactCard",
    },
    element: <ContactCard />,
    exact: true,
    showInDrawer: true,
  },
  {
    path: '/u/:id',
    title: 'URL Redirection', // You can use a different title
    element: <ShortenedURL props={{ api_url: "https://api.thetechcruise.com/u", title: "URL Shortener", description: "Shorten your URL" }} />,
    exact: true,
    showInDrawer: false, // Don't show in the drawer
  },
];
