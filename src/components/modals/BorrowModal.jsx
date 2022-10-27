import {
  Box,
  Button,
  Dai,
  Grid,
  Input,
  Label,
  Modal,
  ModalOverlay,
  Stat,
} from "@unioncredit/ui";

import format from "utils/format";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import useForm from "hooks/useForm";
import { ZERO } from "constants";
import { Errors } from "constants";
import { useProtocol } from "providers/ProtocolData";
import { calculateMaxBorrow } from "utils/numbers";
import { WAD } from "constants";

export const BORROW_MODAL = "borrow-modal";

export default function BorrowModal() {
  const { close } = useModals();
  const { data: member } = useMember();
  const { data: protocol } = useProtocol();

  const {
    creditLimit = ZERO,
    owed = ZERO,
    originationFee = ZERO,
  } = { ...member, ...protocol };

  const validate = (inputs) => {
    if (inputs.amount.raw.gt(creditLimit)) {
      return Errors.INSUFFICIENT_CREDIT_LIMIT;
    }
  };

  const {
    register,
    values = {},
    errors = {},
    empty,
    setRawValue,
  } = useForm({ validate });

  const amount = values.amount || empty;

  const maxBorrow = calculateMaxBorrow(creditLimit, originationFee);

  const newOwed = owed.add(amount.raw);

  const fee = amount.raw.mul(originationFee).div(WAD);

  const borrow = amount.raw.add(fee);

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="BorrowModal">
        <Modal.Header title="Borrow funds" onClose={close} />
        <Modal.Body>
          {/*--------------------------------------------------------------
            Stats Before 
          *--------------------------------------------------------------*/}
          <Grid>
            <Grid.Row>
              <Grid.Col>
                <Stat
                  size="medium"
                  align="center"
                  label="Available credit"
                  value={<Dai value={format(creditLimit)} />}
                />
              </Grid.Col>
              <Grid.Col>
                <Stat
                  size="medium"
                  align="center"
                  label="You owe"
                  value={<Dai value={format(owed)} />}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid>
          {/*--------------------------------------------------------------
            Input 
          *--------------------------------------------------------------*/}
          <Box mt="24px">
            <Input
              type="number"
              name="amount"
              label="Borrow"
              suffix={<Dai />}
              placeholder="0.0"
              error={errors.amount}
              value={amount.display}
              onChange={register("amount")}
              caption={`Max. ${format(maxBorrow)} DAI`}
              onCaptionButtonClick={() => setRawValue("amount", maxBorrow)}
            />
          </Box>
          {/*--------------------------------------------------------------
            Stats After 
          *--------------------------------------------------------------*/}
          <Box justify="space-between" mt="16px">
            <Label as="p" size="small" grey={400}>
              Total including fee
            </Label>
            <Label as="p" size="small" grey={700}>
              {format(borrow)} DAI
            </Label>
          </Box>
          <Box justify="space-between">
            <Label as="p" size="small" grey={400}>
              First Payment Due
            </Label>
            <Label as="p" size="small" grey={700}>
              N/A
            </Label>
          </Box>
          <Box justify="space-between">
            <Label as="p" size="small" grey={400}>
              New balance owed
            </Label>
            <Label as="p" size="small" grey={700}>
              {format(newOwed)} DAI
            </Label>
          </Box>
          {/*--------------------------------------------------------------
            Button 
          *--------------------------------------------------------------*/}
          <Button
            fluid
            mt="18px"
            label={`Borrow ${amount.display} DAI`}
            disabled={amount.raw.lte(ZERO)}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
