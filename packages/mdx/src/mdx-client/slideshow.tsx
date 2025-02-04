import React from "react"
import { EditorProps, EditorStep } from "../mini-editor"
import { InnerCode, updateEditorStep } from "./code"
import { Preview, PresetConfig } from "./preview"
import { extractPreviewSteps } from "./steps"
import { AnimatePresence } from "framer-motion"

export function Slideshow({
  children,
  editorSteps,
  codeConfig,
  presetConfig,
  code,
  className,
  style,
  hasPreviewSteps,
  ...rest
}: {
  children: React.ReactNode
  editorSteps: EditorStep[]
  codeConfig: EditorProps["codeConfig"]
  presetConfig?: PresetConfig
  code?: EditorProps["codeConfig"]
  className?: string
  style?: React.CSSProperties
  hasPreviewSteps?: boolean
}) {
  const { stepsChildren, previewChildren } =
    extractPreviewSteps(children, hasPreviewSteps)
  const withPreview = presetConfig || hasPreviewSteps

  const hasNotes = stepsChildren.some(
    (child: any) => child.props?.children
  )

  const [state, setState] = React.useState({
    stepIndex: 0,
    step: editorSteps[0],
  })
  const tab = state.step

  function onTabClick(filename: string) {
    const newStep = updateEditorStep(
      state.step,
      filename,
      null
    )
    setState({ ...state, step: newStep })
  }

  return (
    <div
      className={`ch-slideshow ${
        withPreview ? "ch-slideshow-with-preview" : ""
      } ${className || ""}`}
      style={style}
    >
      <div className="ch-slideshow-slide">
        <InnerCode
          {...rest}
          {...(tab as any)}
          codeConfig={{
            ...codeConfig,
            ...code,
          }}
          onTabClick={onTabClick}
        />
        {presetConfig ? (
          <Preview
            className="ch-slideshow-preview"
            files={tab.files}
            presetConfig={presetConfig}
            codeConfig={codeConfig}
          />
        ) : hasPreviewSteps ? (
          <Preview
            className="ch-slideshow-preview"
            {...previewChildren[state.stepIndex]["props"]}
          />
        ) : null}
      </div>

      <div className="ch-slideshow-notes">
        <div className="ch-slideshow-range">
          <button
            onClick={() =>
              setState(s => {
                const stepIndex = Math.max(
                  0,
                  s.stepIndex - 1
                )
                return {
                  stepIndex,
                  step: editorSteps[stepIndex],
                }
              })
            }
          >
            Prev
          </button>
          <input
            type="range"
            min={0}
            max={editorSteps.length - 1}
            value={state.stepIndex}
            step={1}
            onChange={e =>
              setState({
                stepIndex: +e.target.value,
                step: editorSteps[+e.target.value],
              })
            }
          />
          <button
            onClick={() =>
              setState(s => {
                const stepIndex = Math.min(
                  editorSteps.length - 1,
                  s.stepIndex + 1
                )
                return {
                  stepIndex,
                  step: editorSteps[stepIndex],
                }
              })
            }
          >
            Next
          </button>
        </div>

        {hasNotes && (
          <div className="ch-slideshow-note">
            <AnimatePresence>
              <>
                {stepsChildren[state.stepIndex]}
              </>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
