import React from "react";
import { useAppStore } from "../AppStore";
import { Card, ICardAction } from "./ui/Card";
import { AssetRow } from "./AssetRow";
import Autocomplete from "./ui/Autocomplete";

export const Assets: React.FC = () => {
  const { accounts, refreshAccounts, addAsset, refreshSupportedAssets, supportedAssets } = useAppStore();
  const [assetIdPrompt, setAssetIdPrompt] = React.useState<string | null>(null);
  const [isAddingAsset, setIsAddingAsset] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const onRefreshClicked = async () => {
    setIsRefreshing(true);
    try {
      await refreshAccounts();
      await refreshSupportedAssets(0);
    } finally {
      setIsRefreshing(false);
    }
  };

  const onAddAssetClicked = async () => {
    if (!assetIdPrompt) {
      return;
    }

    setIsAddingAsset(true);
    try {
      await addAsset(0, assetIdPrompt);
    } finally {
      setIsAddingAsset(false);
      setAssetIdPrompt(null);
    }
  };

  const refeshAction: ICardAction = {
    action: onRefreshClicked,
    label: "Refresh",
    isDisabled: isRefreshing,
  };

  React.useEffect(() => {});

  const hasAccounts = accounts.length > 0;

  return (
    <Card title="Assets" actions={[refeshAction]}>
      <div >
        {hasAccounts &&
          accounts.map((account, index) => (
            <div key={`account${index}`}>
              <label>Account #{index}</label>
              <table className="table table-fixed">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Address</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(account).map(([assetId, assetInfo]) => (
                    <AssetRow key={assetId} assetInfo={assetInfo} />
                  ))}
                </tbody>
              </table>
              <div className="grid grid-cols-[150px_auto_100px] gap-2">
                <label className="label">
                  <span className="label-text">Add asset:</span>
                </label>

                <Autocomplete
                  value={assetIdPrompt ?? ""}
                  onChange={setAssetIdPrompt}
                  items={
                    supportedAssets[index]
                      ? Object.values(supportedAssets[index]).map(({ id, name, iconUrl }) => ({ id, name, iconUrl }))
                      : []
                  }
                />
                {/* <input
                  type="text"
                  className="input input-bordered"
                  value={assetIdPrompt ?? ""}
                  disabled={isAddingAsset}
                  onChange={(e) => setAssetIdPrompt(e.currentTarget.value)}
                /> */}
                <button
                  className="btn btn-secondary"
                  onClick={onAddAssetClicked}
                  disabled={isAddingAsset || !assetIdPrompt || assetIdPrompt.trim().length === 0}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
};
