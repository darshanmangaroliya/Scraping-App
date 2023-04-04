import React from "react";
import { Card } from "react-bootstrap";

interface ScrapData {
  title: string;
  description: string;
  author: string;
  image: string;
  type: string;
  canonicalUrl: string;
  locale: string;
  publishedDate: string;
}
interface Iprops {
  data: ScrapData;
}
const ScrapDataCard: React.FC<Iprops> = ({ data }) => {
  return (
    <>
      {data && (
        <Card className="my-5">
          <Card.Img variant="top" src={data.image} />
          <Card.Body>
            <Card.Title>{data.title}</Card.Title>
            <Card.Text>{data.description}</Card.Text>
            <Card.Text>Author: {data.author}</Card.Text>
            <Card.Text>Type: {data.type}</Card.Text>
            <Card.Text>
              URL: {"  "}<a target="_blank" href={data.canonicalUrl}>{data.canonicalUrl}</a>
            </Card.Text>
            <Card.Text>country_code: {data.locale}</Card.Text>
            <Card.Text>Published Date: {data.publishedDate}</Card.Text>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default ScrapDataCard;
