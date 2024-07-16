import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import CheckBox from '../inputs/CheckBox';

interface ExtractSettingsChecklistProps {
  removePIIOnly?: boolean;
}

const ExtractSettingsChecklist = ({ removePIIOnly }: ExtractSettingsChecklistProps) => {
  const { extractSettings, toggleExtractSetting } = usePlaygroundStore();
  return (
    <div className="relative flex flex-col items-start justify-center gap-4 border-[1px] border-neutral-200 rounded-lg p-4 w-full mt-[300px] shadow-md max-w-[600px]">
      <CheckBox
        label="Remove P.I.I."
        checked={extractSettings.removePII}
        onChange={() => toggleExtractSetting('removePII')}
      />
      {!removePIIOnly && (
        <>
          <div className="font-semibold text-sky-400">Ignore outputting:</div>
          <div className="grid grid-cols-2 md:grid-cols-3">
            <CheckBox
              label="Page Numbers"
              checked={extractSettings.ignorePageNumbers}
              onChange={() => toggleExtractSetting('ignorePageNumbers')}
              alternateColor
            />
            <CheckBox
              label="Footnotes"
              checked={extractSettings.ignoreFootnotes}
              onChange={() => toggleExtractSetting('ignoreFootnotes')}
              alternateColor
            />
            <CheckBox
              label="Headers & Footers"
              checked={extractSettings.ignoreHeadersFooters}
              onChange={() => toggleExtractSetting('ignoreHeadersFooters')}
              alternateColor
            />
            <CheckBox
              label="Tables"
              checked={extractSettings.ignoreTables}
              onChange={() => toggleExtractSetting('ignoreTables')}
              alternateColor
            />
            <CheckBox
              label="Charts & Figures"
              checked={extractSettings.ignoreChartsFigures}
              onChange={() => toggleExtractSetting('ignoreChartsFigures')}
              alternateColor
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ExtractSettingsChecklist;
