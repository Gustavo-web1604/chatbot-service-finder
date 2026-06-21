@echo off
cd /d "%~dp0back"
py -m uvicorn main:app --reload