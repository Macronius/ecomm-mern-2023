import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const SearchBox = () => {
  // routing
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  // component state
  const [keyword, setKeyword] = useState(urlKeyword || "");

  // handler function
  const submitHandler = (e) => {
    e.preventDefault();
    //
    if (keyword.trim) {
        //   navigate(`/search/${keyword}`);
        navigate(`/search/${keyword.trim()}`);
        setKeyword("");
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q" // q = query
        value={keyword}
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-5"
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Button type="submit" variant="outline-light" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
