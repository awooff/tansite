import { Button, Card, Col, Row, Stack } from "react-bootstrap";
import Layout from "../../components/Layout";
import { useProcessStore } from "../../lib/stores/process.store";
import { useContext } from "react";
import GameContext from "../../contexts/game.context";
import ProcessListComponent from "../../components/ProcessesComponent";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const processStore = useProcessStore();
  const game = useContext(GameContext);
  const navigate = useNavigate();

  return (
    <Layout fluid>
      <Row>
        <Col>
          <p className="display-4 border-bottom pb-3 border-success">
            ~/processes/
          </p>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col lg={3}>
          <Row lg={1} className="gy-4">
            <Col>
              <Card body className="bg-transparent border border-secondary">
                <div className="d-grid gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigate("/computers/network");
                    }}
                  >
                    <img
                      src="/icons/network.png"
                      className="mx-auto img-fluid w-50"
                    />
                    <br />
                    View Network
                    <br />
                    <span
                      className={
                        "badge " +
                        (game?.connections?.length !== 0
                          ? "bg-success"
                          : "bg-secondary")
                      }
                    >
                      {game?.connections?.length || 0} ACTIVE CONNECTIONS
                    </span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigate("/computers/");
                    }}
                  >
                    <img
                      src="/icons/query.png"
                      className="mx-auto img-fluid w-50"
                    />
                    <br />
                    View Computers
                    <br />
                    <span className="badge bg-black">
                      {game.computers.length} OWNED
                    </span>
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row className="text-center">
            <Col>
              <Card body>
                <p className="display-5 mt-2">
                  {(() => {
                    let count = 0;
                    Object.values(processStore.processes).forEach(
                      (val) => (count += val.length)
                    );
                    return <span>{count}</span>;
                  })()}{" "}
                </p>
                <span className="badge bg-success">Total Processes</span>
              </Card>
            </Col>
            <Col>
              <Card body>
                <p className="display-5 mt-2">{game.computers.length}</p>
                <span className="badge bg-success">Computers</span>
              </Card>
            </Col>
          </Row>
          <Stack gap={3} className="mt-3">
            {game.connections.map((computer) => (
              <>
                <Row>
                  <Col>
                    <p className="pb-3 border-bottom border-success display-5">
                      {computer.ip}
                    </p>
                    <ProcessListComponent computer={computer} />
                  </Col>
                </Row>
              </>
            ))}
          </Stack>
        </Col>
      </Row>
    </Layout>
  );
}

export default Dashboard;
