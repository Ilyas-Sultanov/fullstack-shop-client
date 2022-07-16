import Card from '../UI/Card/Card';
import Modal from '../UI/Modal/Modal';
import UnitsType from '../../types/Units';

type UnitsModalProps = {
    units: UnitsType[]
    onHide: () => void
    children?: never
}

function UnitsModal({units, onHide}: UnitsModalProps) {
    return (
        <Modal onBackdropClick={onHide}>
            <Card>
                {
                    units.map((item) => item.name)
                }
            </Card>
        </Modal>
    )
}

export default UnitsModal;