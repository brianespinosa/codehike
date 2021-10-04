import React from "react"
import { CodeSpring } from "@code-hike/smooth-code"
import {
  EditorSpring,
  EditorProps,
} from "@code-hike/mini-editor"
import {
  Section,
  SectionLink,
  SectionCode,
} from "./section"

export const CH = {
  Code,
  Section,
  SectionLink,
  SectionCode,
}

type EditorSerializedProps = {
  northPanel: any
  southPanel?: any
  files: any
  codeConfig: any
}

export function Code(
  serializedProps: EditorSerializedProps
) {
  const props = parseEditorProps(serializedProps)
  return <ParsedEditor {...props} />
}

function parseEditorProps({
  northPanel,
  southPanel,
  files,
  codeConfig,
}: EditorSerializedProps): EditorProps {
  return {
    northPanel: northPanel as any,
    southPanel: southPanel as any,
    files: parseFiles(files),
    codeConfig: codeConfig as any,
  }
}

function ParsedEditor(props: EditorProps) {
  if (
    !props.southPanel &&
    props.files.length === 1 &&
    !props.files[0].name
  ) {
    return (
      <CodeSpring
        config={props.codeConfig}
        step={props.files[0]}
      />
    )
  } else {
    return <EditorSpring {...props} />
  }
}
function parseFiles(filesWithoutAnnotations: any[]) {
  return filesWithoutAnnotations.map((data: any) => {
    return {
      ...data,
      annotations: parseAnnotations(data.annotations),
    }
  })
}

function parseAnnotations(annotations: any) {
  return (annotations || []).map(
    ({ type, ...rest }: { type: string }) => ({
      Component: CodeLink,
      ...rest,
    })
  )
}

function CodeLink({
  children,
  data,
}: {
  data: {
    url: string
    title: string | undefined
  }
  children: React.ReactNode
}) {
  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      title={data.title}
      style={{
        textDecoration: "underline",
        textDecorationStyle: "dotted",
      }}
    >
      {children}
    </a>
  )
}
