type User = {
  id: string;
  user_id: string;
  email: string;
};

type Consultant = {
  id: string;
  name: string;
  role: string;
  specialities: string[];
  email: string;
  phone: string;
  location: string;
  top_review: {
    by: string;
    content: string;
  };
  about: string;
  image: string;
  background_image: string;
  secondary_image: string;
};

type Blog = {
  id: string;
  title: string;
  author: string;
  category: string;
  images: string[] | undefined;
  blog_content: string;
  blog_bg: string;
};

type Promotion = {
  id: string;
  title: string;
  image: string;
};

type Testimonial = {
  id: string;
  testimonial: string;
  title: string;
  author: string;
  date: string;
  user_image: string;
}
