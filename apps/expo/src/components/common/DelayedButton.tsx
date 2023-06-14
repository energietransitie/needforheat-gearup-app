import { ButtonProps } from "@rneui/base";
import { Button } from "@rneui/themed";
import { useEffect, useState } from "react";

type DelayedButtonProps = { title: string; timeout: number } & Partial<ButtonProps>;

export default function DelayedButton(props: DelayedButtonProps) {
  const { title, timeout, ...rest } = props;
  const [isDisabled, setIsDisabled] = useState(true);
  const [remainingTime, setRemainingTime] = useState(timeout);

  useEffect(() => {
    if (remainingTime > 0) {
      setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
    } else {
      setIsDisabled(false);
    }
  }, [remainingTime]);

  const buttonTitle = isDisabled ? `${title} (${Math.ceil(remainingTime)})` : title;

  return <Button title={buttonTitle} disabled={isDisabled} {...rest} />;
}
