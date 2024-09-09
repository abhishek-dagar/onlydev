import { useMemo } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CustomHandle from "./custom-handle";
import { Position, useNodeId } from "@xyflow/react";
import CustomIconHandler from "./custom-icon-handler";

type Props = {
  data: any;
};

const CustomNode = ({ data }: Props) => {
  const nodeId = useNodeId();
  const logo = useMemo(() => {
    // return <></>;
    return <CustomIconHandler type={data.icon} />;
  }, [data]);
  return (
    <>
      {/* {data.type !== "Trigger" && data.type !== "Google Drive" && ( */}
      <CustomHandle
        type="target"
        position={Position.Top}
        style={{ zIndex: 100 }}
      />
      {/* // )} */}
      <Card className="relative max-w-[400px] dark:border-muted-foreground/70">
        <CardHeader className="flex flex-row items-center gap-4">
          <div>{logo}</div>
          <div>
            <CardTitle className="text-md">{data.title}</CardTitle>
            <CardDescription>
              {/* <p className="text-xs text-muted-foreground/50">
                <b className="text-muted-foreground/80">ID: </b>
                {nodeId}
              </p> */}
              <p>{data.description}</p>
            </CardDescription>
          </div>
        </CardHeader>
        <Badge variant="secondary" className="absolute right-2 top-2">
          {data.type}
        </Badge>
        {/* <div
          className={clsx("absolute left-3 top-4 h-2 w-2 rounded-full", {
            "bg-green-500": Math.random() < 0.6,
            "bg-orange-500": Math.random() >= 0.6 && Math.random() < 0.8,
            "bg-red-500": Math.random() >= 0.8,
          })}
        ></div> */}
      </Card>
      <CustomHandle type="source" position={Position.Bottom} />
    </>
  );
};

export default CustomNode;