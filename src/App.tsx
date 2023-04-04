import React, { useState } from "react";
import { Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import ScrapDataCard from "./components/ScrapDataCard";
import { isMalwareurl } from "./helper/isMalwareurl";

const App = () => {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<any>("");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    //check for url
    if (!url) {
      setError("Please provide a URL to scrape.");
      setIsLoading(false);
      setData(null);
      return;
    }

    //is valid url
    const regex = new RegExp('^(http|https)://', 'i');
    if (!regex.test(url)) {
      setError("Please provide a valid URL to scrape.");
      setIsLoading(false);
      setData(null);
      return;
    }
    try {
    

      const isMalware  = await isMalwareurl(url)
      if (isMalware) {
        setError('Malicious URL. Try a different URL.');
        setData(null);
        setIsLoading(false);

        return 
      } 

      //get data for current url
      const res = await fetch(
        `http://localhost:3000/scrape?url=${encodeURIComponent(url)}`
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Failed to retrieve data from the URL.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };
   const handleurlchange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setError(null);
    setUrl(e.target.value)
   }
  return (
    <div className="container my-5">
      <h1 className="text-center mb-5">Web Scraper App</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} controlId="formUrl" >
          <Form.Label column sm={2}className="text-center mb-1" >
            Enter URL:
          </Form.Label>
          <Col sm={8} className="mb-1">
            <Form.Control
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={handleurlchange} 
              className={error?"is-invalid":""}
            />
            {error && <p className="text-danger center">{error}</p>}
          </Col>
          <Col sm={2}>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Scrape"}
            </Button>
          </Col>
        </Form.Group>
      </Form>
       <ScrapDataCard data={data}/>
    </div>
  );
};

export default App;
