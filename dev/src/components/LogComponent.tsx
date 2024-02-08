import { Alert, Col, Row, Table } from "react-bootstrap";
import { Computer } from "../lib/types/computer.type";
import { useCallback, useEffect, useState } from "react";
import { postRequestHandler } from "../lib/submit";

type Log = {
  computer: Computer;
  message: string;
  created: string;
  id: number;
  senderId: string;
  senderIp: string;
};

function LogComponent({
  computerId,
  local = false,
  ip,
  connectionId,
}: {
  computerId?: string;
  ip?: string;
  local?: boolean;
  connectionId?: string;
}) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const fetchLogs = useCallback(
    async (
      page: number,
      computerId?: string,
      ip?: string,
      connectionId?: string
    ) => {
      const result = await postRequestHandler<{
        logs: Log[];
        pages: number;
        count: number;
      }>(local ? "/computers/log" : "/internet/log", {
        ...(local ? { computerId: computerId } : { ip: ip }),
        connectionId,
        page: page || 0,
      });

      return result.data;
    },
    []
  );

  useEffect(() => {
    if (local && !computerId) return;
    if (!local && !ip) return;

    fetchLogs(page, computerId, ip, connectionId).then((data) => {
      setLogs(data.logs);
      setCount(data.count);
      setPages(data.pages);
    });
  }, [page, computerId, ip, local, connectionId]);

  return (
    <>
      <Row>
        <Col>
          <Alert className="bg-transparent border border-danger">
            {count} total logs{" "}
            <span
              style={{
                float: "right",
              }}
              className="badge bg-black"
            >
              page {page + 1}/{pages}
            </span>
          </Alert>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table
            striped
            bordered
            hover
            style={{
              fontSize: "12px",
            }}
          >
            <thead>
              <tr>
                <th>message</th>
                <th>sender</th>
                <th>time</th>
              </tr>
            </thead>
            <tbody>
              {logs
                .sort((a, b) => b.id - a.id)
                .map((log, index) => {
                  return (
                    <tr key={index}>
                      <td>{log.message}</td>
                      <td>
                        <a>{log.senderIp}</a>
                      </td>
                      <td>{new Date(log.created).toString()}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}

export default LogComponent;
