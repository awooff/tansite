import React, { useCallback, useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Computer } from "../../lib/types/computer.type";
import GameContext from "../../contexts/game.context";
import { postRequestHandler } from "../../lib/submit";
import toast from "react-hot-toast";
import Display from "../../components/Display";

export type HomepageRequest = {
  computer: Computer;
  markdown: string;
  title: string;
  access?: object;
};

export default function Browser() {
  const game = useContext(GameContext);
  const { ip } = useParams();
  const [computer, setComputer] = useState<Computer | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [valid, setValid] = useState(false);
  const [connectionId, setConnectionId] = useState(
    game?.connections?.find(
      (that) => that.id === localStorage.getItem("currentConnectionId")
    )?.id || game.connections?.[0]?.id
  );
  const [history, setHistory] = useState<Record<string, string>>({});
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [access, setAccess] = useState<object | null>(null);

  const fetchHomepage = useCallback(
    async (ip: string, connectionId: string) => {
      const result = await postRequestHandler<HomepageRequest>(
        "/internet/homepage",
        {
          ip,
          connectionId,
        }
      );

      return result.data;
    },
    []
  );

  useEffect(() => {
    const newIp = ip || currentIp || "0.0.0.0";
    if (
      (newIp !== currentIp && !currentIp) ||
      (currentIp === "0.0.0.0" && ip !== "0.0.0.0")
    ) {
      setValid(false);
      setCurrentIp(newIp);
    }
  }, [ip, fetchHomepage, connectionId, currentIp]);

  useEffect(() => {
    if (!fetchHomepage) return;
    if (!connectionId) return;
    if (!currentIp) return;

    const history = JSON.parse(localStorage.getItem("history") || "{}") || {};

    setHistory((prev) => {
      return {
        ...prev,
        ...history,
      };
    });

    if (currentIp === "0.0.0.0" && history[connectionId]) {
      setCurrentIp(history[connectionId]);
      return;
    }

    const promise = fetchHomepage(currentIp, connectionId).then(
      (data: HomepageRequest) => {
        if (!data) setValid(false);
        else {
          setHistory({
            ...history,
            [connectionId]: currentIp,
          });
          setComputer(data.computer);
          setMarkdown(data.markdown);
          setAccess(data.access || null);
          setValid(true);

          localStorage.setItem(
            "history",
            JSON.stringify({
              ...history,
              [connectionId]: currentIp,
            })
          );
        }
      }
    );
    toast.promise(promise, {
      loading: "Fetching " + currentIp,
      success: "Success",
      error: "Failure",
    });
  }, [fetchHomepage, currentIp, connectionId]);

  return (
    <Layout fluid={true}>
      <Row>
        <Col>
          <Display
            computer={computer}
            connectionId={connectionId}
            valid={valid}
            access={access}
            history={history}
            ip={currentIp || "0.0.0.0"}
            markdown={markdown}
            onVisit={(currentAddress) => {
              if (currentAddress.trim() === currentIp?.trim()) return;

              setValid(false);
              setCurrentIp(currentAddress);
            }}
            onConnectionSwitch={(connection) => {
              localStorage.setItem("currentConnectionId", connection.id);

              if (history[connection.id]) {
                if (currentIp !== history[connection.id]) setValid(false);

                setCurrentIp(history[connection.id]);
              } else {
                setCurrentIp("0.0.0.0");
                setValid(false);
              }

              setConnectionId(connection.id);
            }}
          />
        </Col>
      </Row>
    </Layout>
  );
}
