import "./App.css";
import Routes from "./Routes";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

function App() {
  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
        <LinkContainer to="/">
          <Navbar.Brand className="font-weight-bold text-muted">
            Niner Legends
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
          <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/analytics">
              <Nav.Link>Predictive Analytics</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/delete">
              <Nav.Link>Delete Game</Nav.Link>
            </LinkContainer>
            <a className ="font-weight bold text-muted App container py-3" href="https://docs.google.com/spreadsheets/d/14GjAZZrLRab4mZRZipFaCiXtfIJBexPTNtu0DzPFRv0/edit?usp=sharing">
              Spreadsheet
            </a>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
    </div>
  );
}

export default App;
