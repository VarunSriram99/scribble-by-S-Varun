import React, { useState, useEffect } from "react";

import { Badge } from "neetoui";
import { Typography, Toastr, PageLoader } from "neetoui/v2";
import { useParams } from "react-router-dom";

import publicApi from "apis/public";

function FullArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticle = async () => {
    try {
      const { data } = await publicApi.show(slug);
      setArticle(data.article);
      setIsLoading(false);
    } catch (error) {
      Toastr.error(Error("Error in loading article!"));
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchArticle();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex w-4/5 justify-center">
        <PageLoader className="self-center" />
      </div>
    );
  }

  return (
    <div className="w-4/5 m-4 flex flex-col justify-start space-y-4 overflow-y-scroll h-screen">
      <Typography style="h1">{article.title}</Typography>
      <div className="space-x-4 flex">
        <Badge color="blue" type="squared">
          {article.category}
        </Badge>
        <div className="text-gray-400 font-semibold">{article.date}</div>
      </div>
      <Typography style="body1" className="whitespace-pre-line">
        {article.body}
      </Typography>
    </div>
  );
}

export default FullArticle;
