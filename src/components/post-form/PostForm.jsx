import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "active",
      // image field not set in defaultValues because file inputs are special
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  // Reset form when post changes (for update case)
  useEffect(() => {
    if (post) {
      reset({
        title: post.title || "",
        slug: post.$id || "",
        content: post.content || "",
        status: post.status || "active",
      });
    }
  }, [post, reset]);

  // Slug transform helper
  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")            // non-alphanumeric → hyphen
        .replace(/^-+|-+$/g, "");               // trim hyphens at start/end
    }
    return "";
  }, []);

  // Watch title changes to auto-update slug
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        const newSlug = slugTransform(value.title || "");
        setValue("slug", newSlug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  // Form submission handler
 const onSubmit = async (data) => {
  if (!userData) {
    console.error("No user data found. Please login first.");
    return;
  }

  try {
    let file;
    if (data.image && data.image[0]) {
      file = await appwriteService.uploadFile(data.image[0]);
    }

    if (file) {
      data.featuredImage = file.$id;
    }

    let dbPost;
    if (post) {
      // update
      dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : post.featuredImage,
      });
    } else {
      // create
      dbPost = await appwriteService.createPost({
        ...data,
        userId: userData.$id,
      });
    }

    if (dbPost && dbPost.$id) {
      navigate(`/post/${dbPost.$id}`);
    } else {
      console.error("Post creation/updation failed");
    }
  } catch (error) {
    console.error("Error submitting post:", error);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <span className="text-red-500">{errors.title.message}</span>}

        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: "Slug is required" })}
          onChange={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
          }}
        />
        {errors.slug && <span className="text-red-500">{errors.slug.message}</span>}

        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
          rules={{ required: "Content is required" }}
        />
        {errors.content && <span className="text-red-500">{errors.content.message}</span>}
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image",  )}
        />
        {errors.image && <span className="text-red-500">{errors.image.message}</span>}

        {post && post.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFileView(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: "Status is required" })}
        />
        {errors.status && <span className="text-red-500">{errors.status.message}</span>}

        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" disabled={isSubmitting}>
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
