import React, { useState, useEffect } from "react";

import Logger from "js-logger";
import { Badge } from "neetoui";
import { Typography, PageLoader } from "neetoui/v2";
import { useParams } from "react-router-dom";

import publicApi from "apis/public";

function FullArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchArticle = async () => {
    try {
      const { data } = await publicApi.show(slug);
      setArticle(data.article);
      setIsLoading(false);
    } catch (error) {
      Logger.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    fetchArticle();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex w-4/5 justify-center">
        <PageLoader className="self-center" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-4 w-4/5 text-center">
        <Typography style="h1">Page doesn't exist.</Typography>
        <Typography style="h4" className="m-4">
          Please enter a valid url or select an article from the Sidebar.
        </Typography>
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
