// @ts-nocheck

import { SupabaseClient } from "@supabase/supabase-js";
import { ChangeEvent } from "react";

export const checkIfUserIsAdmin = async (
  email: string,
  supabase: SupabaseClient
) => {
  try {
    const { data, error } = await supabase
      .from("auth_users")
      .select("*")
      .eq("email", email);

    if (error) {
      throw error;
    } else {
      return data[0] !== undefined;
    }
  } catch (error) {
    console.log("Something went wrong");
  }
};

export const fetchConsultantFromId = async (
  id: string,
  supabase: SupabaseClient
) => {
  try {
    const { data, error } = await supabase
      .from("consultants")
      .select("*")
      .eq("id", id);

    if (error) throw error;

    return data[0] as Consultant;
  } catch (error) {
    console.log(error);
  }
};

export const getUrlForSelectedImage = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files![0];
  const fileUrl = URL.createObjectURL(file);

  return fileUrl;
};

export const getUrlForSelectedImages = (e: ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files!;
  const fileUrls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileUrl = URL.createObjectURL(file);
    fileUrls.push(fileUrl);
  }

  return fileUrls;
};

const uploadImage = async (
  file: File,
  folder: string,
  supabase: SupabaseClient
) => {
  try {
    const { data, error } = await supabase.storage
      .from(folder)
      .upload(`${file.name}`, file, {
        upsert: true,
      });

    if (error) throw error;

    return true;
  } catch (error) {
    console.log(error);
  }
};

export const uploadImages = async (
  file: File,
  supabase: SupabaseClient,
  folder: string
) => {
  try {
    const yearInSeconds = 31536000;

    await uploadImage(file, folder, supabase);

    const { data, error } = await supabase.storage
      .from(folder)
      .createSignedUrl(`${file.name}`, yearInSeconds);

    return data?.signedUrl;
  } catch (error) {
    console.log(error);
  }
};

export const updateConsultant = async (
  consultant: Consultant,
  supabase: SupabaseClient,
  consultantImage: File,
  backgroundImage: File,
  secondaryImage: File,
  toast: any,
  shouldUpdateImages: boolean,

  oldImages: string[]
) => {
  try {
    const consultantFolder = "staff";

    let consultantImageURL = consultant.image || undefined;
    let backgroundImageURL = consultant.background_image || undefined;
    let secondaryImageURL = consultant.secondary_image || undefined;

    if (consultantImage !== undefined) {
      await removeImageFromBucket(supabase, "staff", [oldImages[0]]);

      consultantImageURL = await uploadImages(
        consultantImage,
        supabase,
        consultantFolder
      );
    }

    if (backgroundImage !== undefined) {
      await removeImageFromBucket(supabase, "staff", [oldImages[1]]);

      backgroundImageURL = await uploadImages(
        backgroundImage,
        supabase,
        consultantFolder
      );
    }

    if (secondaryImage !== undefined) {
      await removeImageFromBucket(supabase, "staff", [oldImages[2]]);

      secondaryImageURL = await uploadImages(
        secondaryImage,
        supabase,
        consultantFolder
      );
    }

    const { error } = await supabase
      .from("consultants")
      .update({
        ...consultant,
        image: consultantImageURL,
        background_image: backgroundImageURL,
        secondary_image: secondaryImageURL,
      })
      .eq("id", consultant.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Consultant updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const createConsultant = async (
  supabase: SupabaseClient,
  name: string,
  consultantImage: File,
  toast: any,
) => {
  try {
    const consultantFolder = "staff";

    const consultantImageURL = await uploadImages(
      consultantImage,
      supabase,
      consultantFolder
    );

    const { data, error } = await supabase
      .from("consultants")
      .insert([
        {
          name: name,
          image: consultantImageURL,
          about: "",
          email: "",
          phone: "",
          background_image: "",
          location: "",
          role: "",
          secondary_image: "",
          specialities: [],
          top_review: {
            by: "",
            content: "",
          },
        },
      ])
      .select();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } else {
      toast({
        title: "Success",
        description: "Consultant created successfully",
      });
      return data[0].id;
    }
  } catch (error) {
    console.log(error);
  }
};

export const removeImageFromBucket = async (
  supabase: SupabaseClient,
  bucket: string,
  images: string[]
) => {
  try {
    images = images.map((image) => {
      const splitUrl = image.split("/");
      const imageName = splitUrl[splitUrl.length - 1].split("?")[0];
      return imageName;
    });

    console.log("Image urls: " + images);

    const { error } = await supabase.storage.from(bucket).remove(images);

    if (error) {
      console.log("Error deleting image: " + error.message);
      alert(error.message);
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteConsultant = async (
  supabase: SupabaseClient,
  consultant: Consultant,
  toast: any
) => {
  try {
    const images = [
      consultant.image,
      consultant.background_image,
      consultant.secondary_image,
    ];

    await removeImageFromBucket(supabase, "staff", images);

    const { error } = await supabase
      .from("consultants")
      .delete()
      .eq("id", consultant.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Consultant deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const checkIfImageIsBig = (file: File) => {
  if (file.size > 3000000) {
    return true;
  } else {
    return false;
  }
};

export const fetchBlogs = async (supabase: SupabaseClient) => {
  try {
    const { data, error } = await supabase.from("blogs").select("*");

    if (error) throw error;

    return data as Blog[];
  } catch (error) {
    console.log(error);
  }
};

export const fetchBlogFromId = async (id: string, supabase: SupabaseClient) => {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id);

    if (error) throw error;

    console.log(data[0].images);
    return data[0] as Blog;
  } catch (error) {
    console.log(error);
  }
};

export const updateBlog = async (
  blog: Blog,
  supabase: SupabaseClient,
  blogBg: File,
  galleryImages: File[],
  toast: any,
  oldImages: string[]
) => {
  try {
    const blogFolder = "blogs";

    let blogBgURL = blog.blog_bg;
    let galleryImagesURL = blog.images;

    if (blogBg !== undefined) {
      await removeImageFromBucket(supabase, "blogs", [oldImages[oldImages.length - 1]]);
      blogBgURL = await uploadImages(blogBg, supabase, blogFolder);
    }

    if (galleryImages !== undefined) {
      await removeImageFromBucket(supabase, "blogs", oldImages.slice(0, oldImages.length - 1));
      const images = await Promise.all(
        galleryImages.map(async (image) => {
          return await uploadImages(image, supabase, blogFolder);
        })
      );

      galleryImagesURL = images;
    }

    const { error } = await supabase
      .from("blogs")
      .update({
        ...blog,
        blog_bg: blogBgURL,
        images: galleryImagesURL,
      })
      .eq("id", blog.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteBlog = async (
  supabase: SupabaseClient,
  blog: Blog,
  toast: any
) => {
  try {
    const images = blog.images;
    const blogBg = blog.blog_bg;

    await removeImageFromBucket(supabase, "blogs", [blogBg!]);
    await removeImageFromBucket(supabase, "blogs", images!);

    const { error } = await supabase.from("blogs").delete().eq("id", blog.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const createBlog = async (
  supabase: SupabaseClient,
  blogTitle: string,
  blogBg: File,
  toast: any
) => {
  try {
    const blogFolder = "blogs";

    const blogBgURL = await uploadImages(blogBg, supabase, blogFolder);

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title: blogTitle,
          author: "",
          category: "",
          images: [],
          blog_content: "",
          blog_bg: blogBgURL,
        },
      ])
      .select();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } else {
      toast({
        title: "Success",
        description: "Article created successfully",
      });
      return data[0].id;
    }
  } catch (error) {
    console.log(error);
  }
};

export const limitText = (text: string, limit: number) => {
  if (text.length > limit) {
    return text.slice(0, limit) + "...";
  } else {
    return text;
  }
};

export const fetchPromotions = async (supabase: SupabaseClient) => {
  try {
    const { data, error } = await supabase.from("promotions").select("*");

    if (error) throw error;

    return data as Promotion[];
  } catch (error) {
    console.log(error);
  }
};

export const createPromotion = async (
  supabase: SupabaseClient,
  promotionTitle: string,
  promotionBg: File,
  toast: any
) => {
  try {
    const promotionFolder = "promotions";

    const promotionBgURL = await uploadImages(
      promotionBg,
      supabase,
      promotionFolder
    );

    const { data, error } = await supabase.from("promotions").insert([
      {
        title: promotionTitle,
        image: promotionBgURL,
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      return false;
    } else {
      toast({
        title: "Success",
        description: "Promotion created successfully",
      });

      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export const updatePromotion = async (
  supabase: SupabaseClient,
  id: string,
  title: string,
  promotionBg: File,
  toast: any,
  oldImage: string
) => {
  try {
    const promotionFolder = "promotions";

    let promotionBgURL = promotionBg;

    if (promotionBg !== undefined) {
      await removeImageFromBucket(supabase, "promotions", [oldImage]);
      promotionBgURL = await uploadImages(
        promotionBg,
        supabase,
        promotionFolder
      );
    }

    const { error } = await supabase
      .from("promotions")
      .update({
        title: title,
        image: promotionBgURL,
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Promotion updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deletePromotion = async (
  supabase: SupabaseClient,
  id: string,
  toast: any,
  oldImage: string
) => {
  try {
    await removeImageFromBucket(supabase, "promotions", [oldImage]); 

    const { error } = await supabase.from("promotions").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Promotion deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchTestimonials = async (supabase: SupabaseClient) => {
  try {
    const { data, error } = await supabase.from("testimonials").select("*");

    if (error) throw error;

    return data as Testimonial[];
  } catch (error) {
    console.log(error);
  }
};

export const fetchTestimonialFromId = async (
  id: string,
  supabase: SupabaseClient
) => {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("id", id);

    if (error) throw error;

    return data[0] as Testimonial;
  } catch (error) {
    console.log(error);
  }
};

export const updateTestimonial = async (
  supabase: SupabaseClient,
  testimonial: Testimonial,
  user_image: File,
  toast: any
) => {
  try {
    const testimonialFolder = "testimonials";

    let userImageURL = testimonial.user_image;

    if (user_image !== undefined) {
      console.log(userImageURL);
      await removeImageFromBucket(supabase, "testimonials", [userImageURL!]);

      userImageURL = await uploadImages(
        user_image,
        supabase,
        testimonialFolder
      );
    }

    const { error } = await supabase
      .from("testimonials")
      .update({
        ...testimonial,
        user_image: userImageURL,
      })
      .eq("id", testimonial.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteTestimonial = async (
  supabase: SupabaseClient,
  testimonial: Testimonial,
  toast: any
) => {
  try {
    const images = [testimonial.user_image!];

    await removeImageFromBucket(supabase, "testimonials", images);

    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", testimonial.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const createTestimonial = async (
  supabase: SupabaseClient,
  title: string,
  user_image: File,
  toast: any
) => {
  try {
    const testimonialFolder = "testimonials";

    const userImageURL = await uploadImages(
      user_image,
      supabase,
      testimonialFolder
    );

    const { data, error } = await supabase
      .from("testimonials")
      .insert([
        {
          title: title,
          testimonial: "",
          author: "",
          date: "",
          user_image: userImageURL,
        },
      ])
      .select();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } else {
      toast({
        title: "Success",
        description: "Testimonial created successfully",
      });
      return data[0].id;
    }
  } catch (error) {
    console.log(error);
  }
};


export const fetchShowcases = async (supabase: SupabaseClient) => {
  try {
    const { data, error } = await supabase.from("showcases").select("*");

    if (error) throw error;

    return data as Showcase[];
  } catch (error) {
    console.log(error);
  }
};

export const createShowcase = async (
  supabase: SupabaseClient,
  image: File,
  description: string,
  toast: any
) => {
  try {
    const showcaseFolder = "showcases";

    const imageURL = await uploadImages(image, supabase, showcaseFolder);

    const { data, error } = await supabase
      .from("showcases")
      .insert([
        {
          image: imageURL,
          description: description,
        },
      ])
      .select();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      return false;
    } else {
      toast({
        title: "Success",
        description: "Showcase created successfully",
      });

      return true;
    }
  } catch (error) {
    console.log(error);
  }
}

export const updateShowcase = async (
  supabase: SupabaseClient,
  id: string,
  image: File,
  description: string,
  toast: any,
  oldImage: string
) => {
  try {
    const showcaseFolder = "showcases";

    let imageURL = image;

    if (image !== undefined) {
      await removeImageFromBucket(supabase, "showcases", [oldImage]);
      imageURL = await uploadImages(image, supabase, showcaseFolder);
    }

    const { error } = await supabase
      .from("showcases")
      .update({
        image: imageURL,
        description: description,
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      return false;
    } else {
      toast({
        title: "Success",
        description: "Showcase updated successfully",
      });

      return true;
    }
  } catch (error) {
    console.log(error);
  }
}

export const deleteShowcase = async (
  supabase: SupabaseClient,
  id: string,
  toast: any,
  oldImage: string
) => {
  try {
    await removeImageFromBucket(supabase, "showcases", [oldImage]);

    const { error } = await supabase.from("showcases").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });

      return false;
    } else {
      toast({
        title: "Success",
        description: "Showcase deleted successfully",
      });

      return true;
    }
  } catch (error) {
    console.log(error);
  }
}