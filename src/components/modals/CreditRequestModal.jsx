import {
  Modal,
  ModalOverlay,
  Box,
  Card,
  Button,
  ButtonRow,
  Label,
  Select,
} from "@unioncredit/ui";
import { useState } from "react";
import QRCode from "qrcode.react";
import { useAccount, chain } from "wagmi";
import { ReactComponent as Twitter } from "@unioncredit/ui/lib/icons/twitter.svg";
import { ReactComponent as Telegram } from "@unioncredit/ui/lib/icons/telegram.svg";

import { EIP3770 } from "constants";
import { networks } from "config/networks";
import { useModals } from "providers/ModalManager";
import { truncateAddress } from "utils/truncateAddress";
import useCopyToClipboard from "hooks/useCopyToClipboard";

export const CREDIT_REQUEST_MODAL = "credit-request-modal";

export default function CreditRequestModal() {
  const { close } = useModals();
  const { address } = useAccount();

  const [copied, copy] = useCopyToClipboard();
  const [network, setNetwork] = useState(chain.mainnet.id);

  const eip3770 = EIP3770[network] || "eth";

  const url = `http://app.union.finance/profile/${eip3770}:${address}`;

  const urlDisplay = `http://app.union.finance/profile/${eip3770}:${truncateAddress(
    address
  )}`;

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header onClose={close} title="Credit request" />
        <Modal.Body>
          <Box align="center" justify="center" direction="vertical">
            <Select
              options={networks}
              defaultValue={networks[0]}
              onChange={(option) => setNetwork(option.chainId)}
            />

            <Card packed mt="8px">
              <Box my="16px" fluid justify="center">
                <QRCode
                  value={url}
                  fgColor="#032437"
                  size={120}
                  renderAs="svg"
                  className="QRCode"
                />
              </Box>
              <Box mb="16px" direction="vertical" align="center">
                <Label
                  as="p"
                  m={0}
                  style={{
                    wordBreak: "break-all",
                    textAlign: "center",
                    padding: "0 10px",
                  }}
                >
                  {urlDisplay}
                </Label>
                <Button
                  mt="8px"
                  variant="pill"
                  onClick={() => copy(url)}
                  label={copied ? "Copied!" : "Copy link"}
                />
              </Box>
            </Card>
            <ButtonRow fluid mt="8px">
              <Button
                fluid
                as="a"
                color="blue"
                variant="secondary"
                icon={Twitter}
                label="Twitter"
                href="#"
              />
              <Button
                fluid
                as="a"
                color="blue"
                variant="secondary"
                icon={Telegram}
                label="Telegram"
                href="#"
              />
            </ButtonRow>
          </Box>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
