import React, { useState } from 'react';
import { Button, Modal } from '@payloadcms/ui'

const MyCustomSelector = ({ onChange, value }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);

  const handleSelectionChange = (e) => {
    const newSelection = e.target.value;
    // Check if changing to this selection might cause data loss
    if (shouldShowWarning(newSelection)) { // Implement your data loss check logic here
      setPendingSelection(newSelection);
      setShowWarning(true);
    } else {
      onChange(newSelection); // Proceed directly if no warning needed
    }
  };

  const handleConfirm = () => {
    onChange(pendingSelection);
    setShowWarning(false);
    setPendingSelection(null);
  };

  const handleCancel = () => {
    setShowWarning(false);
    setPendingSelection(null);
    // Optionally, revert the selection in the UI if it was already changed
  };

  const shouldShowWarning = (newSelection) => {
    // Your logic to determine if data loss might occur
    // e.g., if changing from 'optionA' to 'optionB' clears other fields
    return newSelection === 'optionB' && value === 'optionA';
  };

  return (
    <div>
      <select value={value} onChange={handleSelectionChange}>
        <option value="optionA">Option A</option>
        <option value="optionB">Option B (may lose data)</option>
      </select>

      {showWarning && (
        <Modal title="Warning: Data Loss Possible" slug="data-loss-warning">
          <p>Changing this selection may result in the loss of unsaved data in other fields. Do you want to proceed?</p>
          <Button buttonStyle="primary" onClick={handleConfirm}>Confirm</Button>
          <Button buttonStyle="secondary" onClick={handleCancel}>Cancel</Button>
        </Modal>
      )}
    </div>
  );
};

export default MyCustomSelector;
